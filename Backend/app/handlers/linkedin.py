import os
import json
import logging
import time
import warnings
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from app.models import Node


logging.basicConfig(level=logging.INFO)
warnings.filterwarnings("ignore")

async def execute(node: Node) -> str:
    """Execute LinkedIn scraping for a profile URL."""
    try:
        li_at = os.environ.get("LI_AT")
        if not li_at:
            return "Error: LI_AT environment variable is not set. Please set your LinkedIn session cookie."
        
        profile_url = node.data.profileUrl
        if not profile_url:
            return "Error: No LinkedIn profile URL provided."
        
        if not profile_url.startswith("https://www.linkedin.com/in/"):
            return "Error: Invalid LinkedIn profile URL. URL should start with 'https://www.linkedin.com/in/'"
        
        
        profile_data = await scrape_profile(profile_url, li_at)
        
        return json.dumps(profile_data, indent=2)
    
    except Exception as e:
        logging.error(f"Error in LinkedIn scraper: {str(e)}")
        return f"Error scraping LinkedIn profile: {str(e)}"

async def scrape_profile(url, li_at):
    """Scrape a LinkedIn profile using the comprehensive extraction logic."""
    options = webdriver.ChromeOptions()
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-gpu")
    options.add_argument("--headless")
    
    driver = None
    try:
        driver = webdriver.Chrome(options=options)
        
        driver.get("https://www.linkedin.com")
        driver.add_cookie({
            'name': 'li_at',
            'value': li_at,
            'domain': '.linkedin.com'
        })
        driver.refresh()
        
        logging.info(f"Scraping profile: {url}")
        driver.get(url)
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        scroll_down(driver)
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, 'lxml')
        
        profile_data = {}
        name_selectors = [
            ('h1', {'class': 'text-heading-xlarge'}),
            ('h1', {'class': 'break-words'}),
            ('h1', {'class': 'inline t-24 t-black t-normal break-words'}),
            ('h1', {'id': 'pv-contact-info'}),
            ('span', {'class': 'text-heading-xlarge inline t-24 v-align-middle break-words'})
        ]
        
        name = None
        for selector in name_selectors:
            name_element = soup.find(selector[0], selector[1])
            if name_element and name_element.get_text(strip=True):
                name = name_element.get_text(strip=True)
                break
      
        if not name:
            all_h1 = soup.find_all('h1')
            for h1 in all_h1:
                if h1.get_text(strip=True) and len(h1.get_text(strip=True)) < 50:
                    name = h1.get_text(strip=True)
                    break
        
        profile_data['name'] = name
        
        headline = soup.find('div', {'class': 'text-body-medium break-words'})
        if headline:
            profile_data['headline'] = headline.get_text(strip=True)
        
        about_section = soup.find('div', {'class': 'display-flex ph5 pv3'})
        if about_section:
            profile_data['about'] = about_section.get_text(strip=True)
        
      
        sections = soup.find_all('section', {'class': 'artdeco-card pv-profile-card break-words mt2'})
        
        for sec in sections:
            if sec.find('div', {'id': 'education'}):
                profile_data['education'] = sec.get_text(strip=True)
                break
        
        for sec in sections:
            if sec.find('div', {'id': 'experience'}):
                experience_items = sec.find_all('li', recursive=True)
                experiences = []
                for item in experience_items:
                    if item.parent.name == 'ul' and item.get_text(strip=True):
                        experiences.append(item.get_text(strip=True))
                
                profile_data['experience'] = experiences
                break
      
        skills = []
        for exp in profile_data.get('experience', []):
            if 'skills' in exp.lower():
                skills_part = exp.lower().split('skills')[1].strip()
                if skills_part:
                    extracted_skills = [s.strip() for s in skills_part.replace(' and ', ', ').split(',')]
                    skills.extend([s for s in extracted_skills if s])
        
        if skills:
            profile_data['skills'] = list(dict.fromkeys(skills))
        
        
        for sec in sections:
            if sec.find('div', {'id': 'organizations'}):
                organization_items = sec.find_all('li', {'class': 'artdeco-list__item'})
                profile_data['organizations'] = [{
                    'name': item.find('span', {'aria-hidden': 'true'}).get_text(strip=True) if item.find('span', {'aria-hidden': 'true'}) else None,
                    'role': item.find('span', {'class': 't-14 t-normal'}).get_text(strip=True) if item.find('span', {'class': 't-14 t-normal'}) else None
                } for item in organization_items]
                break
        
        profile_data['interests'] = {
            'Top Voices': [],
            'Companies': [],
            'Groups': [],
            'Newsletters': [],
            'Schools': []
        }
        
        
        interests_section = None
        for sec in sections:
            interest_div = sec.find('div', {'id': 'interests'})
            if interest_div:
                interests_section = sec
                break
        
        if not interests_section:
            for sec in sections:
                if sec.find('span', string=lambda text: text and 'Interests' in text):
                    interests_section = sec
                    break
        
        if interests_section:
           
            interest_items = interests_section.find_all('li')
            
            if interest_items:
                for item in interest_items:
                    text = item.get_text(strip=True)
                    
                    if any(kw in text.lower() for kw in ["chair", "head", "keynote", "speaker", "researcher", "coach"]):
                        if text and "\n" in text:
                            profile_data['interests']['Top Voices'].append(text.split("\n")[0])
                        else:
                            profile_data['interests']['Top Voices'].append(text)
                    elif "followers" in text.lower():
                        profile_data['interests']['Companies'].append(text.split("followers")[0].strip())
                    elif "members" in text.lower():
                        profile_data['interests']['Groups'].append(text.split("members")[0].strip())
                    elif "published" in text.lower():
                        profile_data['interests']['Newsletters'].append(text.split("published")[0].strip())
                    elif "alumni" in text.lower() or "university" in text.lower() or "college" in text.lower() or "school" in text.lower():
                        profile_data['interests']['Schools'].append(text.split("alumni")[0].strip() if "alumni" in text.lower() else text)
            else:

                text = interests_section.get_text(strip=True)
                if "Interests" in text:
                    profile_data['interests']['raw_text'] = text
        
       
        for sec in sections:
            if sec.find('div', {'id': 'certifications'}):
                cert_items = sec.find_all('li')
                profile_data['certifications'] = [item.get_text(strip=True) for item in cert_items]
                break
        
      
        for sec in sections:
            if sec.find('div', {'id': 'projects'}):
                project_items = sec.find_all('li')
                profile_data['projects'] = [item.get_text(strip=True) for item in project_items]
                break
   
        for category in list(profile_data['interests'].keys()):
            if not profile_data['interests'][category]:
                del profile_data['interests'][category]

        if not any(profile_data['interests'].values()):
        
            interest_uls = soup.find_all('ul', {'class': lambda c: c and 'entity-list' in c})
            for ul in interest_uls:
                items = ul.find_all('li')
                for item in items:
                    text = item.get_text(strip=True)
                    if "followers" in text.lower():
                        profile_data['interests']['Companies'].append(text.split("followers")[0].strip())
                    elif "members" in text.lower():
                        profile_data['interests']['Groups'].append(text.split("members")[0].strip())
                    elif "alumni" in text.lower():
                        profile_data['interests']['Schools'].append(text.split("alumni")[0].strip())
        logging.info(f"Successfully scraped profile for: {profile_data.get('name', 'Unknown')}")
        
        return profile_data
    
    finally:
        if driver:
            driver.quit()

def scroll_down(driver):
    """Scroll down to load all dynamic content."""
    logging.info("Scrolling down the page...")
    last_height = driver.execute_script("return document.body.scrollHeight")

    scroll_attempts = 0
    max_scroll_attempts = 10
    
    while scroll_attempts < max_scroll_attempts:
        driver.find_element(By.TAG_NAME, "body").send_keys(Keys.END)
        time.sleep(1)
        
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            driver.find_element(By.TAG_NAME, "body").send_keys(Keys.PAGE_DOWN)
            time.sleep(1)
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
        
        last_height = new_height
        scroll_attempts += 1
    
    try:
        show_more_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Show more')]")
        for button in show_more_buttons:
            try:
                driver.execute_script("arguments[0].click();", button)
                time.sleep(0.5)
            except:
                pass  
                
        see_all_buttons = driver.find_elements(By.XPATH, "//span[contains(text(), 'See all')]/parent::button")
        for button in see_all_buttons:
            try:
                driver.execute_script("arguments[0].click();", button)
                time.sleep(0.5)
            except:
                pass  
    except:
        logging.info("No expandable buttons found or couldn't click them.")