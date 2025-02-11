import AskAINode from './AskAINode';
import ExtractData from './ExtractData';
import Summarizer from './SummarizerNode';
import Categorizer from './CategorizerNode';
import Analyzer from './AnalyzerNode';

export const nodeTypes = {
  askAI: AskAINode,
  extractData: ExtractData,
  summarizer: Summarizer,
  categorizer: Categorizer,
  analyzer: Analyzer,
};

export {
  AskAINode,
  ExtractData,
  Summarizer,
  Categorizer,
  Analyzer,
};