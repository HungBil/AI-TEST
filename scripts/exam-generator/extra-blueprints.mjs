import { EXAM_11 } from './extra-blueprint-11.mjs';
import { EXAM_13 } from './review-set-c.mjs';

const EXAM_12 = {
  no: 12,
  variantOf: 2,
  title: 'RAG, retrieval và kiểm chứng câu trả lời',
  description: 'Đề mở rộng nhẹ quanh embedding, retrieval, thiếu bằng chứng, citation và cách phân biệt lỗi tìm nguồn với lỗi sinh câu trả lời; không yêu cầu vector math nâng cao.',
  aProbability: ['bayesTwo', 'conditionalGroup', 'totalProbability', 'withoutReplacementBoth', 'complementAtLeastOne', 'conditionalDice', 'binomialExact', 'union', 'independenceCheck', 'combinations'],
  aMatrix: ['matrixDimensions', 'matrixProductElement', 'matrixAddition', 'determinant', 'inverseEntry', 'transpose', 'solveSystem', 'rankProportional', 'identityProduct', 'diagonalVector'],
  bMcq: ['gcdValue', 'oneIteration', 'recursionOutput', 'complexity', 'getParamsTimeout', 'raiseStatus', 'responseJson', 'safeKey', 'requestException', 'statusMeaning', 'schemaValidation', 'shape', 'vectorBroadcast', 'sumAxis0', 'sliceColumn1d', 'booleanMask', 'reshapeNdim', 'meanAxis1'],
  bOpen: ['traceGcd', 'explainNumpyShapes'],
  cMcq: ['ragRetrieval', 'ragEmbedding', 'ragNoEvidence', 'humanReview', 'monitoring', 'confusionRecall', 'svmPurpose', 'validationRole', 'overfit'],
  cEssays: ['apiPreprocessingDebug', 'ragEvaluation', 'ragInternal'],
  dSkills: ['leastPrivilege', 'groupAccess', 'dataMinimization', 'purposeLimitation', 'consent', 'humanApproval', 'auditLog', 'fairnessCheck']
};

export const EXTRA_EXAM_BLUEPRINTS = [EXAM_11, EXAM_12, EXAM_13];
