import { EXAM_11 } from './extra-blueprint-11.mjs';

const EXAM_12 = {
  no: 12,
  variantOf: 2,
  title: 'Embedding, semantic search và chất lượng RAG',
  description: 'Đề mở rộng nhẹ quanh chunking, cosine similarity, top-k, retrieval và generation, cùng citation; không yêu cầu vector math nâng cao.',
  aProbability: ['bayesTwo', 'conditionalGroup', 'totalProbability', 'withoutReplacementBoth', 'complementAtLeastOne', 'conditionalDice', 'binomialExact', 'union', 'independenceCheck', 'combinations'],
  aMatrix: ['matrixDimensions', 'matrixProductElement', 'matrixAddition', 'determinant', 'inverseEntry', 'transpose', 'solveSystem', 'rankProportional', 'identityProduct', 'diagonalVector'],
  bMcq: ['gcdValue', 'oneIteration', 'recursionOutput', 'complexity', 'getParamsTimeout', 'raiseStatus', 'responseJson', 'safeKey', 'requestException', 'statusMeaning', 'schemaValidation', 'shape', 'vectorBroadcast', 'sumAxis0', 'sliceColumn1d', 'booleanMask', 'reshapeNdim', 'meanAxis1'],
  bOpen: ['traceGcd', 'explainNumpyShapes'],
  cMcq: ['ragRetrieval', 'ragEmbedding', 'cosineSimilarityMeaning', 'chunkSizeTradeoff', 'topKTradeoff', 'retrievalVsGeneration', 'ragNoEvidence', 'citationVersioning', 'humanReview'],
  cEssays: [],
  dSkills: ['groupAccess', 'dataMinimization', 'purposeLimitation', 'sourceCitation', 'highRiskEscalate', 'humanApproval', 'auditLog', 'incidentResponse']
};

export const EXTRA_EXAM_BLUEPRINTS = [EXAM_11, EXAM_12];
