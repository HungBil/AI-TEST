import { mcq, qid, frac, choose, formatNumber, matrixToText } from './shared.mjs';

const BAYES_TWO = [
  { prevalence: 0.1, sensitivity: 0.8, falsePositive: 0.2 },
  { prevalence: 0.2, sensitivity: 0.75, falsePositive: 0.25 },
  { prevalence: 0.25, sensitivity: 0.8, falsePositive: 0.2 },
  { prevalence: 1 / 6, sensitivity: 0.75, falsePositive: 0.25 },
  { prevalence: 0.2, sensitivity: 0.9, falsePositive: 0.3 }
];

const BAYES_ONE = [
  { prevalence: 0.1, sensitivity: 0.8, falsePositive: 0.2 },
  { prevalence: 0.2, sensitivity: 0.75, falsePositive: 0.25 },
  { prevalence: 0.25, sensitivity: 0.8, falsePositive: 0.2 },
  { prevalence: 0.2, sensitivity: 0.9, falsePositive: 0.1 },
  { prevalence: 1 / 3, sensitivity: 0.75, falsePositive: 0.25 }
];

function percent(value) {
  return `${formatNumber(value * 100, 2)}%`;
}

function bayesPosterior({ prevalence, sensitivity, falsePositive }, tests) {
  const disease = prevalence * sensitivity ** tests;
  const healthy = (1 - prevalence) * falsePositive ** tests;
  return disease / (disease + healthy);
}

const probabilityFactories = {
  bayesTwo(examNo, id) {
    const data = BAYES_TWO[examNo - 1];
    const answer = percent(bayesPosterior(data, 2));
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Một bệnh có tỷ lệ mắc ${percent(data.prevalence)}. Xét nghiệm phát hiện đúng người mắc bệnh với xác suất ${percent(data.sensitivity)} và cho dương tính giả với xác suất ${percent(data.falsePositive)}. Giả sử hai lần xét nghiệm độc lập khi đã biết tình trạng bệnh. Một người có hai lần đều dương tính. Xác suất người đó thực sự mắc bệnh gần nhất là:`,
      correct: answer,
      distractors: [percent(data.sensitivity ** 2), percent(data.prevalence), percent(1 - data.falsePositive)],
      explanation: `Dùng Bayes: tử số là P(bệnh)×P(++|bệnh), mẫu số cộng thêm P(không bệnh)×P(++|không bệnh). Kết quả gần ${answer}.`,
      tags: ['probability', 'bayes', 'conditional-probability'], skillId: 'probability.bayes.two-positive-tests'
    });
  },
  bayesOne(examNo, id) {
    const data = BAYES_ONE[examNo - 1];
    const answer = percent(bayesPosterior(data, 1));
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Tỷ lệ mắc bệnh là ${percent(data.prevalence)}. Xét nghiệm có độ nhạy ${percent(data.sensitivity)} và tỷ lệ dương tính giả ${percent(data.falsePositive)}. Khi một người có kết quả dương tính một lần, xác suất người đó mắc bệnh gần nhất là:`,
      correct: answer,
      distractors: [percent(data.sensitivity), percent(data.prevalence), percent(1 - data.falsePositive)],
      explanation: `P(bệnh|+) = P(bệnh)P(+|bệnh) / [P(bệnh)P(+|bệnh)+P(không bệnh)P(+|không bệnh)] ≈ ${answer}.`,
      tags: ['probability', 'bayes'], skillId: 'probability.bayes.one-positive-test'
    });
  },
  conditionalGroup(examNo, id) {
    const known = 12 + examNo * 2;
    const both = 4 + examNo;
    const answer = frac(both, known);
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Trong một nhóm có ${known} người biết Python; trong đó ${both} người biết cả Python và SQL. Chọn ngẫu nhiên một người trong số những người biết Python. Xác suất người đó cũng biết SQL là:`,
      correct: answer,
      distractors: [frac(both, known + 5), frac(known - both, known), frac(both + 1, known)],
      explanation: `Đã biết người được chọn thuộc nhóm biết Python nên P(SQL|Python)=${both}/${known}=${answer}.`,
      tags: ['probability', 'conditional-probability'], skillId: 'probability.conditional.from-subgroup'
    });
  },
  conditionalTable(examNo, id) {
    const positive = 20 + examNo * 2;
    const truePositive = 12 + examNo;
    const answer = frac(truePositive, positive);
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Một bảng thống kê cho biết có ${positive} người nhận kết quả dương tính, trong đó ${truePositive} người thực sự mắc bệnh. Chọn ngẫu nhiên một người trong nhóm có kết quả dương tính. Xác suất người đó mắc bệnh là:`,
      correct: answer,
      distractors: [frac(truePositive, 100), frac(positive - truePositive, positive), frac(positive, 100)],
      explanation: `Điều kiện là đã dương tính, nên xác suất bằng ${truePositive}/${positive}=${answer}.`,
      tags: ['probability', 'conditional-probability', 'table'], skillId: 'probability.conditional.from-count-table'
    });
  },
  totalProbability(examNo, id) {
    const shareA = [60, 70, 50, 80, 40][examNo - 1];
    const errA = [2, 1, 2, 1, 3][examNo - 1];
    const errB = [5, 4, 6, 5, 2][examNo - 1];
    const answerValue = shareA / 100 * errA + (100 - shareA) / 100 * errB;
    const answer = `${formatNumber(answerValue, 2)}%`;
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Máy A sản xuất ${shareA}% sản phẩm và có tỷ lệ lỗi ${errA}%. Máy B sản xuất phần còn lại và có tỷ lệ lỗi ${errB}%. Chọn ngẫu nhiên một sản phẩm. Xác suất sản phẩm bị lỗi là:`,
      correct: answer,
      distractors: [`${errA}%`, `${errB}%`, `${errA + errB}%`],
      explanation: `Dùng xác suất toàn phần: ${shareA / 100}×${errA}% + ${(100 - shareA) / 100}×${errB}% = ${answer}.`,
      tags: ['probability', 'total-probability'], skillId: 'probability.total-probability.two-sources'
    });
  },
  withoutReplacementBoth(examNo, id) {
    const red = 4 + examNo;
    const blue = 3 + (examNo % 3);
    const answer = frac(red * (red - 1), (red + blue) * (red + blue - 1));
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Một túi có ${red} bi đỏ và ${blue} bi xanh. Rút liên tiếp 2 bi không hoàn lại. Xác suất cả hai bi đều đỏ là:`,
      correct: answer,
      distractors: [frac(red, red + blue), frac(red - 1, red + blue - 1), frac(red * blue, (red + blue) * (red + blue - 1))],
      explanation: `P= ${red}/${red + blue} × ${red - 1}/${red + blue - 1} = ${answer}.`,
      tags: ['probability', 'without-replacement'], skillId: 'probability.without-replacement.same-colour'
    });
  },
  withoutReplacementMixed(examNo, id) {
    const red = 3 + examNo;
    const blue = 4 + (examNo % 2);
    const total = red + blue;
    const numerator = 2 * red * blue;
    const answer = frac(numerator, total * (total - 1));
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Một túi có ${red} bi đỏ và ${blue} bi xanh. Rút 2 bi không hoàn lại. Xác suất hai bi khác màu là:`,
      correct: answer,
      distractors: [frac(red * blue, total * (total - 1)), frac(red, total), frac(blue, total)],
      explanation: `Có hai thứ tự đỏ-xanh và xanh-đỏ, nên P=2×${red}×${blue}/(${total}×${total - 1})=${answer}.`,
      tags: ['probability', 'without-replacement'], skillId: 'probability.without-replacement.different-colours'
    });
  },
  conditionalDice(examNo, id) {
    const threshold = [2, 3, 1, 2, 3][examNo - 1];
    const outcomes = [1, 2, 3, 4, 5, 6].filter((value) => value > threshold);
    const even = outcomes.filter((value) => value % 2 === 0).length;
    const answer = frac(even, outcomes.length);
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Gieo một xúc xắc công bằng. Biết kết quả lớn hơn ${threshold}, xác suất kết quả là số chẵn bằng:`,
      correct: answer,
      distractors: ['1/3', '1/2', '2/3', '3/4'].filter((value) => value !== answer),
      explanation: `Không gian có điều kiện là {${outcomes.join(', ')}}; có ${even}/${outcomes.length} kết quả chẵn, nên xác suất là ${answer}.`,
      tags: ['probability', 'conditional-probability', 'dice'], skillId: 'probability.conditional.dice'
    });
  },
  binomialExact(examNo, id) {
    const tosses = [3, 4, 4, 3, 5][examNo - 1];
    const heads = [2, 1, 2, 1, 2][examNo - 1];
    const answer = frac(choose(tosses, heads), 2 ** tosses);
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Tung đồng xu công bằng ${tosses} lần. Xác suất có đúng ${heads} lần ngửa là:`,
      correct: answer,
      distractors: [frac(1, 2 ** tosses), frac(heads, 2 ** tosses), '1/2'],
      explanation: `Có C(${tosses},${heads})=${choose(tosses, heads)} chuỗi phù hợp trên ${2 ** tosses} chuỗi đồng khả năng, nên xác suất là ${answer}.`,
      tags: ['probability', 'binomial', 'combinations'], skillId: 'probability.binomial.exact-successes'
    });
  },
  union(examNo, id) {
    const pA = [0.4, 0.5, 0.3, 0.6, 0.4][examNo - 1];
    const pB = [0.5, 0.4, 0.6, 0.3, 0.5][examNo - 1];
    const intersection = [0.2, 0.1, 0.2, 0.1, 0.3][examNo - 1];
    const answer = formatNumber(pA + pB - intersection, 2);
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Cho P(A)=${formatNumber(pA)}, P(B)=${formatNumber(pB)} và P(A∩B)=${formatNumber(intersection)}. P(A∪B) bằng:`,
      correct: answer,
      distractors: [formatNumber(pA + pB), formatNumber(intersection), formatNumber(1 - intersection)],
      explanation: `P(A∪B)=P(A)+P(B)-P(A∩B)=${answer}.`,
      tags: ['probability', 'union'], skillId: 'probability.union.inclusion-exclusion'
    });
  },
  complementAtLeastOne(examNo, id) {
    const trials = [3, 2, 4, 3, 4][examNo - 1];
    const failNumerator = [1, 2, 1, 1, 2][examNo - 1];
    const failDenominator = [4, 5, 3, 5, 5][examNo - 1];
    const none = (failNumerator / failDenominator) ** trials;
    const answer = frac(failDenominator ** trials - failNumerator ** trials, failDenominator ** trials);
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Một phép thử độc lập có xác suất thất bại ${failNumerator}/${failDenominator}. Thực hiện ${trials} lần. Xác suất có ít nhất một lần thành công là:`,
      correct: answer,
      distractors: [frac(failNumerator ** trials, failDenominator ** trials), frac(failDenominator - failNumerator, failDenominator), formatNumber(1 - none, 2)],
      explanation: `P(ít nhất một thành công)=1-P(tất cả thất bại)=1-(${failNumerator}/${failDenominator})^${trials}=${answer}.`,
      tags: ['probability', 'complement'], skillId: 'probability.complement.at-least-one'
    });
  },
  independenceCheck(examNo, id) {
    const sets = [
      [1 / 2, 1 / 3, 1 / 6],
      [2 / 5, 1 / 2, 1 / 5],
      [1 / 4, 2 / 3, 1 / 6],
      [3 / 5, 1 / 2, 3 / 10],
      [1 / 3, 3 / 4, 1 / 4]
    ];
    const [pA, pB, pBoth] = sets[examNo - 1];
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Cho P(A)=${formatNumber(pA, 3)}, P(B)=${formatNumber(pB, 3)} và P(A∩B)=${formatNumber(pBoth, 3)}. Kết luận đúng là:`,
      correct: 'A và B độc lập',
      distractors: ['A và B xung khắc', 'P(A|B)=1', 'Không thể so sánh'],
      explanation: `P(A)P(B)=${formatNumber(pA * pB, 3)}=P(A∩B), nên A và B độc lập.`,
      tags: ['probability', 'independence'], skillId: 'probability.independence.product-rule'
    });
  },
  independenceFromTable(examNo, id) {
    const total = 100;
    const a = [40, 50, 30, 60, 40][examNo - 1];
    const b = [50, 40, 60, 30, 50][examNo - 1];
    const both = a * b / total;
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Trong ${total} quan sát, có ${a} quan sát thuộc A, ${b} quan sát thuộc B và ${both} quan sát thuộc cả A lẫn B. Kết luận phù hợp nhất là:`,
      correct: 'A và B độc lập theo bảng đếm này',
      distractors: ['A và B chắc chắn xung khắc', 'P(A|B)=1', 'Không thể tính P(A∩B)'],
      explanation: `P(A)P(B)=(${a}/${total})×(${b}/${total})=${both}/${total}=P(A∩B).`,
      tags: ['probability', 'independence', 'table'], skillId: 'probability.independence.from-count-table'
    });
  },
  expectation(examNo, id) {
    const sets = [
      { values: [0, 1, 2], probs: [0.25, 0.5, 0.25] },
      { values: [0, 1, 2], probs: [0.5, 0.25, 0.25] },
      { values: [1, 2, 3], probs: [0.25, 0.5, 0.25] },
      { values: [0, 2, 4], probs: [0.5, 0.25, 0.25] },
      { values: [1, 2, 4], probs: [0.5, 0.25, 0.25] }
    ];
    const data = sets[examNo - 1];
    const value = data.values.reduce((sum, x, i) => sum + x * data.probs[i], 0);
    const answer = formatNumber(value, 2);
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Biến ngẫu nhiên X nhận các giá trị ${data.values.join(', ')} với xác suất lần lượt ${data.probs.map((p) => formatNumber(p, 2)).join(', ')}. Kỳ vọng E[X] bằng:`,
      correct: answer,
      distractors: [formatNumber(value + 0.5), formatNumber(Math.max(0, value - 0.5)), String(data.values.length)],
      explanation: `E[X]=ΣxP(X=x)=${answer}.`,
      tags: ['probability', 'expectation'], skillId: 'probability.expectation.discrete'
    });
  },
  bernoulliVariance(examNo, id) {
    const p = [0.2, 0.25, 0.4, 0.5, 0.6][examNo - 1];
    const answer = formatNumber(p * (1 - p), 3);
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Biến Bernoulli X có P(X=1)=${formatNumber(p, 2)}. Phương sai Var(X) bằng:`,
      correct: answer,
      distractors: [formatNumber(p ** 2, 3), formatNumber(1 - p, 3), formatNumber(p, 3)],
      explanation: `Với Bernoulli, Var(X)=p(1-p)=${answer}.`,
      tags: ['probability', 'variance', 'bernoulli'], skillId: 'probability.bernoulli.variance'
    });
  },
  combinations(examNo, id) {
    const n = [6, 7, 8, 6, 7][examNo - 1];
    const k = [2, 3, 2, 3, 2][examNo - 1];
    const answer = String(choose(n, k));
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Có ${n} người. Có bao nhiêu cách chọn ${k} người vào một nhóm nếu không phân biệt thứ tự?`,
      correct: answer,
      distractors: [String(n * k), String(n ** k), String(Math.max(1, choose(n, k) - 1))],
      explanation: `Số cách là C(${n},${k})=${answer}.`,
      tags: ['probability', 'combinations'], skillId: 'probability.combinations.choose-k'
    });
  },
  probabilityTree(examNo, id) {
    const first = [0.5, 0.6, 0.4, 0.5, 0.7][examNo - 1];
    const secondGivenFirst = [0.4, 0.5, 0.5, 0.6, 0.4][examNo - 1];
    const answer = formatNumber(first * secondGivenFirst, 2);
    return mcq({
      id, module: 'A', points: 1,
      prompt: `P(A)=${formatNumber(first, 2)} và P(B|A)=${formatNumber(secondGivenFirst, 2)}. Xác suất A và B cùng xảy ra là:`,
      correct: answer,
      distractors: [formatNumber(first + secondGivenFirst, 2), formatNumber(secondGivenFirst / first, 2), formatNumber(first, 2)],
      explanation: `P(A∩B)=P(A)P(B|A)=${answer}.`,
      tags: ['probability', 'conditional-probability', 'tree'], skillId: 'probability.tree.joint-from-conditional'
    });
  }
};

const MATRIX_DATA = [
  { A: [[1, 2], [3, 4]], B: [[2, 1], [1, 2]] },
  { A: [[2, 1], [1, 1]], B: [[1, 2], [3, 1]] },
  { A: [[1, 3], [2, 1]], B: [[2, 0], [1, 2]] },
  { A: [[2, 2], [1, 3]], B: [[1, 1], [2, 1]] },
  { A: [[3, 1], [2, 2]], B: [[1, 2], [0, 1]] }
];

function multiply2(A, B) {
  return [
    [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
    [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]
  ];
}

const matrixFactories = {
  matrixDimensions(examNo, id) {
    const sets = [[2, 3, 3, 2], [3, 2, 2, 4], [2, 4, 4, 3], [3, 3, 3, 2], [2, 5, 5, 2]];
    const [r1, c1, r2, c2] = sets[examNo - 1];
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Ma trận A có kích thước ${r1}×${c1}, ma trận B có kích thước ${r2}×${c2}. Kích thước của AB là:`,
      correct: `${r1}×${c2}`,
      distractors: [`${c1}×${r2}`, `${r2}×${c2}`, `${r1}×${c1}`],
      explanation: `Hai kích thước ở giữa bằng nhau; kích thước ngoài là ${r1}×${c2}.`,
      tags: ['linear-algebra', 'matrix'], skillId: 'matrix.multiplication.dimensions'
    });
  },
  matrixProductElement(examNo, id) {
    const { A, B } = MATRIX_DATA[examNo - 1];
    const P = multiply2(A, B);
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Cho A=${matrixToText(A)} và B=${matrixToText(B)}. Phần tử hàng 1, cột 2 của AB bằng:`,
      correct: String(P[0][1]),
      distractors: [String(P[0][0]), String(P[1][0]), String(P[1][1])],
      explanation: `Lấy hàng 1 của A nhân cột 2 của B: ${A[0][0]}×${B[0][1]}+${A[0][1]}×${B[1][1]}=${P[0][1]}.`,
      tags: ['linear-algebra', 'matrix-multiplication'], skillId: 'matrix.multiplication.single-entry'
    });
  },
  matrixProductFull(examNo, id) {
    const { A, B } = MATRIX_DATA[examNo - 1];
    const P = multiply2(A, B);
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Cho A=${matrixToText(A)} và B=${matrixToText(B)}. Tích AB bằng:`,
      correct: matrixToText(P),
      distractors: [matrixToText(multiply2(B, A)), matrixToText(A), matrixToText(B)],
      explanation: `Nhân từng hàng của A với từng cột của B, thu được ${matrixToText(P)}.`,
      tags: ['linear-algebra', 'matrix-multiplication'], skillId: 'matrix.multiplication.full-2x2'
    });
  },
  matrixAddition(examNo, id) {
    const A = [[examNo, 2], [1, 3]];
    const B = [[1, examNo + 1], [2, 1]];
    const answer = matrixToText([[A[0][0] + B[0][0], A[0][1] + B[0][1]], [3, 4]]);
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Cho A=${matrixToText(A)} và B=${matrixToText(B)}. A+B bằng:`,
      correct: answer,
      distractors: [matrixToText(A), matrixToText(B), matrixToText([[A[0][0] * B[0][0], A[0][1] * B[0][1]], [2, 3]])],
      explanation: `Cộng các phần tử cùng vị trí, được ${answer}.`,
      tags: ['linear-algebra', 'matrix-addition'], skillId: 'matrix.addition.full-2x2'
    });
  },
  scalarMultiply(examNo, id) {
    const k = 2 + (examNo % 3);
    const A = [[1, examNo], [2, 3]];
    const answer = matrixToText(A.map((row) => row.map((value) => k * value)));
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Cho A=${matrixToText(A)}. Ma trận ${k}A bằng:`,
      correct: answer,
      distractors: [matrixToText(A), matrixToText(A.map((row) => row.map((value) => value + k))), matrixToText([[k, examNo], [2, 3]])],
      explanation: `Nhân mọi phần tử của A với ${k}, được ${answer}.`,
      tags: ['linear-algebra', 'scalar-multiplication'], skillId: 'matrix.scalar-multiplication'
    });
  },
  determinant(examNo, id) {
    const sets = [[[2, 1], [1, 1]], [[3, 1], [2, 1]], [[1, 2], [1, 3]], [[2, 3], [1, 2]], [[4, 1], [2, 1]]];
    const A = sets[examNo - 1];
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Định thức của ma trận A=${matrixToText(A)} bằng:`,
      correct: String(det),
      distractors: [String(A[0][0] * A[1][1] + A[0][1] * A[1][0]), String(A.flat().reduce((a, b) => a + b, 0)), String(-det)],
      explanation: `det(A)=ad-bc=${A[0][0]}×${A[1][1]}-${A[0][1]}×${A[1][0]}=${det}.`,
      tags: ['linear-algebra', 'determinant'], skillId: 'matrix.determinant.2x2'
    });
  },
  inverseEntry(examNo, id) {
    const sets = [[[2, 1], [1, 1]], [[1, 1], [1, 2]], [[3, 1], [2, 1]], [[1, 2], [1, 3]], [[2, 1], [3, 2]]];
    const A = sets[examNo - 1];
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    const answer = frac(A[1][1], det);
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Cho A=${matrixToText(A)}. Phần tử hàng 1, cột 1 của A⁻¹ bằng:`,
      correct: answer,
      distractors: [frac(A[0][0], det), frac(-A[0][1], det), String(det)],
      explanation: `A⁻¹=(1/det(A))[[d,-b],[-c,a]], nên phần tử (1,1)=d/det=${answer}.`,
      tags: ['linear-algebra', 'inverse-matrix'], skillId: 'matrix.inverse.single-entry-2x2'
    });
  },
  inverseFull(examNo, id) {
    const sets = [[[2, 1], [1, 1]], [[1, 1], [1, 2]], [[3, 1], [2, 1]], [[1, 2], [1, 3]], [[2, 1], [3, 2]]];
    const A = sets[examNo - 1];
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    const inverse = [[frac(A[1][1], det), frac(-A[0][1], det)], [frac(-A[1][0], det), frac(A[0][0], det)]];
    const answer = matrixToText(inverse);
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Cho A=${matrixToText(A)}. Ma trận nghịch đảo A⁻¹ là:`,
      correct: answer,
      distractors: [matrixToText([[A[1][1], -A[0][1]], [-A[1][0], A[0][0]]]), matrixToText(A), matrixToText([[A[0][0], -A[0][1]], [-A[1][0], A[1][1]]])],
      explanation: `Dùng công thức A⁻¹=(1/det(A))[[d,-b],[-c,a]], thu được ${answer}.`,
      tags: ['linear-algebra', 'inverse-matrix'], skillId: 'matrix.inverse.full-2x2'
    });
  },
  transpose(examNo, id) {
    const A = [[1, examNo + 1], [2, 3]];
    const answer = matrixToText([[1, 2], [examNo + 1, 3]]);
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Cho A=${matrixToText(A)}. Aᵀ bằng:`,
      correct: answer,
      distractors: [matrixToText(A), matrixToText([[3, 2], [examNo + 1, 1]]), matrixToText([[1, examNo + 1], [3, 2]])],
      explanation: `Chuyển hàng thành cột, được ${answer}.`,
      tags: ['linear-algebra', 'transpose'], skillId: 'matrix.transpose.2x2'
    });
  },
  solveSystem(examNo, id) {
    const x = examNo;
    const y = 2;
    const c1 = x + y;
    const c2 = 2 * x - y;
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Giải hệ: x+y=${c1}, 2x-y=${c2}. Nghiệm (x,y) là:`,
      correct: `(${x}, ${y})`,
      distractors: [`(${y}, ${x})`, `(${x + 1}, ${y - 1})`, `(${c1}, ${c2})`],
      explanation: `Cộng hai phương trình được 3x=${3 * x}, nên x=${x}; thay vào được y=${y}.`,
      tags: ['linear-algebra', 'linear-system'], skillId: 'matrix.linear-system.two-equations'
    });
  },
  solveAX(examNo, id) {
    const A = [[1, 1], [2, -1]];
    const x = [examNo, 2];
    const b = [x[0] + x[1], 2 * x[0] - x[1]];
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Cho A=${matrixToText(A)} và b=[${b.join(',')}]. Vector x thỏa Ax=b là:`,
      correct: `[${x.join(',')}]`,
      distractors: [`[${x[1]},${x[0]}]`, `[${b.join(',')}]`, `[${x[0] + 1},${x[1] - 1}]`],
      explanation: `Giải hệ x₁+x₂=${b[0]}, 2x₁-x₂=${b[1]}, thu được x=[${x.join(',')}].`,
      tags: ['linear-algebra', 'linear-system'], skillId: 'matrix.solve-ax-equals-b'
    });
  },
  rankProportional(examNo, id) {
    const k = examNo + 1;
    const A = [[1, 2], [k, 2 * k]];
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Hạng của ma trận A=${matrixToText(A)} là:`,
      correct: '1',
      distractors: ['0', '2', String(k)],
      explanation: `Hàng thứ hai bằng ${k} lần hàng thứ nhất, nên chỉ có một hàng độc lập tuyến tính; rank=1.`,
      tags: ['linear-algebra', 'rank'], skillId: 'matrix.rank.proportional-rows'
    });
  },
  diagonalVector(examNo, id) {
    const a = examNo + 1;
    const b = examNo + 2;
    const x = [2, 3];
    const answer = `[${a * x[0]},${b * x[1]}]`;
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Cho D=diag(${a},${b}) và x=[${x.join(',')}]. Tích Dx bằng:`,
      correct: answer,
      distractors: [`[${a + x[0]},${b + x[1]}]`, `[${a * x[1]},${b * x[0]}]`, `[${a},${b}]`],
      explanation: `Ma trận chéo nhân từng phần tử tương ứng: Dx=${answer}.`,
      tags: ['linear-algebra', 'diagonal-matrix'], skillId: 'matrix.diagonal-times-vector'
    });
  },
  singularRecognition(examNo, id) {
    const k = examNo + 1;
    const A = [[1, 2], [k, 2 * k]];
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Ma trận A=${matrixToText(A)} có nghịch đảo hay không?`,
      correct: 'Không, vì det(A)=0',
      distractors: ['Có, vì mọi ma trận 2×2 đều khả nghịch', 'Có, vì các phần tử đều khác 0', 'Không, vì ma trận không đối xứng'],
      explanation: `det(A)=1×${2 * k}-2×${k}=0, nên A suy biến và không có nghịch đảo.`,
      tags: ['linear-algebra', 'inverse-matrix', 'determinant'], skillId: 'matrix.inverse.singular-recognition'
    });
  },
  identityProduct(examNo, id) {
    const A = [[examNo, 1], [2, 3]];
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Cho I là ma trận đơn vị 2×2 và A=${matrixToText(A)}. Tích AI bằng:`,
      correct: matrixToText(A),
      distractors: [matrixToText([[1, 0], [0, 1]]), matrixToText([[examNo, 0], [0, 3]]), matrixToText([[examNo + 1, 1], [2, 4]])],
      explanation: `Nhân với ma trận đơn vị không làm thay đổi ma trận: AI=A.`,
      tags: ['linear-algebra', 'identity-matrix'], skillId: 'matrix.identity.product'
    });
  },
  nonCommutative(examNo, id) {
    const { A, B } = MATRIX_DATA[examNo - 1];
    const AB = matrixToText(multiply2(A, B));
    const BA = matrixToText(multiply2(B, A));
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Với A=${matrixToText(A)} và B=${matrixToText(B)}, nhận xét nào đúng?`,
      correct: AB === BA ? 'Trong trường hợp này AB=BA' : 'Trong trường hợp này AB≠BA',
      distractors: ['Luôn luôn AB=BA với mọi ma trận vuông', 'AB không xác định', 'BA không xác định'],
      explanation: `Tính được AB=${AB} và BA=${BA}; phép nhân ma trận nói chung không giao hoán.`,
      tags: ['linear-algebra', 'matrix-multiplication'], skillId: 'matrix.multiplication.non-commutative'
    });
  },
  transposeSum(examNo, id) {
    const A = [[1, examNo], [2, 3]];
    const B = [[0, 1], [examNo + 1, 2]];
    const sum = [[1, examNo + 1], [examNo + 3, 5]];
    const answer = matrixToText([[sum[0][0], sum[1][0]], [sum[0][1], sum[1][1]]]);
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Cho A=${matrixToText(A)} và B=${matrixToText(B)}. (A+B)ᵀ bằng:`,
      correct: answer,
      distractors: [matrixToText(sum), matrixToText(A), matrixToText(B)],
      explanation: `Cộng A+B trước rồi chuyển vị, được ${answer}.`,
      tags: ['linear-algebra', 'transpose', 'matrix-addition'], skillId: 'matrix.transpose.of-sum'
    });
  },
  unknownEntry(examNo, id) {
    const x = examNo + 1;
    const A = [[x, 2], [1, 3]];
    const target = 2 * x + 2;
    return mcq({
      id, module: 'A', points: 1,
      prompt: `Cho A=[[x,2],[1,3]] và B=[[2,0],[1,1]]. Biết phần tử hàng 1, cột 1 của AB bằng ${target}. Giá trị x là:`,
      correct: String(x),
      distractors: [String(x - 1), String(x + 1), String(target)],
      explanation: `Phần tử (1,1) của AB là 2x+2=${target}, nên x=${x}.`,
      tags: ['linear-algebra', 'matrix-equation'], skillId: 'matrix.multiplication.solve-unknown-entry'
    });
  }
};

export function buildModuleA(examNo, blueprint) {
  const questions = [];
  blueprint.aProbability.forEach((skill, index) => {
    const factory = probabilityFactories[skill];
    if (!factory) throw new Error(`Không có factory Module A xác suất: ${skill}`);
    questions.push(factory(examNo, qid(examNo, 'A', index + 1)));
  });
  blueprint.aMatrix.forEach((skill, index) => {
    const factory = matrixFactories[skill];
    if (!factory) throw new Error(`Không có factory Module A ma trận: ${skill}`);
    questions.push(factory(examNo, qid(examNo, 'A', index + 11)));
  });
  return questions;
}
