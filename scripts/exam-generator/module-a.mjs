import { mcq, qid, frac, choose, bayesSets, machineSets, matrixInverseSets } from './shared.mjs';

export function buildModuleA(examNo) {
  const index = examNo - 1;
  const questions = [];
  const bayes = bayesSets[index];
  const [pn, pd] = bayes.p;
  const [sn, sd] = bayes.s;
  const [fn, fd] = bayes.f;
  questions.push(mcq({
    id: qid(examNo, 'A', 1), module: 'A', points: 1,
    prompt: `Một bệnh có tỷ lệ mắc ${pn}/${pd}. Xét nghiệm có độ nhạy ${sn}/${sd} và tỷ lệ dương tính giả ${fn}/${fd}. Giả sử hai lần kiểm tra độc lập khi đã biết tình trạng bệnh. Một người kiểm tra hai lần đều dương tính. Xác suất người đó thực sự mắc bệnh là:`,
    correct: bayes.answer,
    distractors: ['1/4', '1/2', '3/4', '4/5', '9/10'].filter((value) => value !== bayes.answer),
    explanation: `Áp dụng Bayes cho hai lần dương tính: [(${pn}/${pd})×(${sn}/${sd})²] / {[(${pn}/${pd})×(${sn}/${sd})²] + [(1-${pn}/${pd})×(${fn}/${fd})²]} = ${bayes.answer}.`,
    tags: ['probability', 'bayes']
  }));

  const knownA = 12 + index;
  const both = 4 + (index % 5);
  const cond = frac(both, knownA);
  questions.push(mcq({
    id: qid(examNo, 'A', 2), module: 'A', points: 1,
    prompt: `Trong một nhóm, có ${knownA} người biết Python và ${both} người vừa biết Python vừa biết SQL. Chọn ngẫu nhiên một người trong số những người biết Python. Xác suất người đó cũng biết SQL là:`,
    correct: cond,
    distractors: [frac(both, knownA + 4), frac(knownA - both, knownA), frac(both + 1, knownA + 1)],
    explanation: `Đã biết người được chọn thuộc nhóm biết Python, nên xác suất có điều kiện bằng ${both}/${knownA} = ${cond}.`,
    tags: ['conditional-probability']
  }));

  const machine = machineSets[index];
  const totalError = (machine.share * machine.errA + (100 - machine.share) * machine.errB) / 100;
  questions.push(mcq({
    id: qid(examNo, 'A', 3), module: 'A', points: 1,
    prompt: `Máy A sản xuất ${machine.share}% sản phẩm và có tỷ lệ lỗi ${machine.errA}%. Máy B sản xuất phần còn lại và có tỷ lệ lỗi ${machine.errB}%. Chọn ngẫu nhiên một sản phẩm. Xác suất sản phẩm bị lỗi là:`,
    correct: `${String(totalError).replace('.', ',')}%`,
    distractors: [`${machine.errA}%`, `${machine.errB}%`, `${machine.errA + machine.errB}%`],
    explanation: `Xác suất toàn phần = ${machine.share / 100}×${machine.errA}% + ${(100 - machine.share) / 100}×${machine.errB}% = ${String(totalError).replace('.', ',')}%.`,
    tags: ['total-probability']
  }));

  const red = 4 + (index % 3);
  const blue = 3 + ((index + 1) % 3);
  const allRed = frac(red * (red - 1), (red + blue) * (red + blue - 1));
  questions.push(mcq({
    id: qid(examNo, 'A', 4), module: 'A', points: 1,
    prompt: `Một túi có ${red} bi đỏ và ${blue} bi xanh. Rút lần lượt 2 bi không hoàn lại. Xác suất cả hai bi đều đỏ là:`,
    correct: allRed,
    distractors: [frac(red, red + blue), frac(red - 1, red + blue - 1), frac(red * blue, (red + blue) * (red + blue - 1))],
    explanation: `P = ${red}/${red + blue} × ${red - 1}/${red + blue - 1} = ${allRed}.`,
    tags: ['probability', 'without-replacement']
  }));

  const threshold = 2 + (index % 3);
  const outcomes = Array.from({ length: 6 - threshold }, (_, i) => threshold + 1 + i);
  const even = outcomes.filter((value) => value % 2 === 0).length;
  const diceAnswer = frac(even, outcomes.length);
  questions.push(mcq({
    id: qid(examNo, 'A', 5), module: 'A', points: 1,
    prompt: `Gieo một xúc xắc công bằng. Biết kết quả lớn hơn ${threshold}, xác suất kết quả là số chẵn bằng:`,
    correct: diceAnswer,
    distractors: ['1/3', '1/2', '2/3', '3/4'].filter((value) => value !== diceAnswer),
    explanation: `Không gian có điều kiện là {${outcomes.join(',')}}; có ${even} kết quả chẵn trên ${outcomes.length} kết quả, nên xác suất là ${diceAnswer}.`,
    tags: ['conditional-probability', 'dice']
  }));

  const tosses = 3 + (index % 2);
  const heads = index % 2 === 0 ? 2 : 1;
  const coinAnswer = frac(choose(tosses, heads), 2 ** tosses);
  questions.push(mcq({
    id: qid(examNo, 'A', 6), module: 'A', points: 1,
    prompt: `Tung đồng xu công bằng ${tosses} lần. Xác suất có đúng ${heads} lần ngửa là:`,
    correct: coinAnswer,
    distractors: [frac(1, 2 ** tosses), frac(heads, 2 ** tosses), '1/2', '3/4'],
    explanation: `Có C(${tosses},${heads}) = ${choose(tosses, heads)} chuỗi phù hợp trên ${2 ** tosses} chuỗi đồng khả năng, nên xác suất là ${coinAnswer}.`,
    tags: ['binomial', 'combinations']
  }));

  const aNum = 1 + (index % 3);
  const aDen = 5;
  const bNum = 2 + (index % 2);
  const bDen = 6;
  const interNum = 1;
  const interDen = 10;
  const union = aNum / aDen + bNum / bDen - interNum / interDen;
  const unionText = frac(Math.round(union * 30), 30);
  questions.push(mcq({
    id: qid(examNo, 'A', 7), module: 'A', points: 1,
    prompt: `Cho P(A)=${aNum}/${aDen}, P(B)=${bNum}/${bDen} và P(A∩B)=${interNum}/${interDen}. P(A∪B) bằng:`,
    correct: unionText,
    distractors: [frac(aNum, aDen), frac(bNum, bDen), frac(Math.round((aNum / aDen + bNum / bDen) * 30), 30)],
    explanation: `P(A∪B)=P(A)+P(B)-P(A∩B)=${aNum}/${aDen}+${bNum}/${bDen}-${interNum}/${interDen}=${unionText}.`,
    tags: ['union', 'inclusion-exclusion']
  }));

  questions.push(mcq({
    id: qid(examNo, 'A', 8), module: 'A', points: 1,
    prompt: `Hai biến cố A và B có P(A)=1/2, P(B)=1/3 và P(A∩B)=1/6. Kết luận đúng là:`,
    correct: 'A và B độc lập',
    distractors: ['A và B xung khắc', 'P(A|B)=1', 'P(B|A)=1'],
    explanation: `P(A)P(B)=1/2×1/3=1/6=P(A∩B), nên A và B độc lập.`,
    tags: ['independence']
  }));

  const values = [0, 1, 2];
  const probs = index % 2 === 0 ? [[1, 4], [1, 2], [1, 4]] : [[1, 2], [1, 4], [1, 4]];
  const expectation = values.reduce((sum, value, i) => sum + value * probs[i][0] / probs[i][1], 0);
  const expectationText = Number.isInteger(expectation) ? String(expectation) : frac(Math.round(expectation * 4), 4);
  questions.push(mcq({
    id: qid(examNo, 'A', 9), module: 'A', points: 1,
    prompt: `Biến ngẫu nhiên X nhận các giá trị 0, 1, 2 với xác suất lần lượt ${probs.map(([n, d]) => `${n}/${d}`).join(', ')}. Kỳ vọng E[X] bằng:`,
    correct: expectationText,
    distractors: ['1/2', '3/4', '1', '5/4'].filter((value) => value !== expectationText),
    explanation: `E[X]=0×${probs[0][0]}/${probs[0][1]}+1×${probs[1][0]}/${probs[1][1]}+2×${probs[2][0]}/${probs[2][1]}=${expectationText}.`,
    tags: ['expectation']
  }));

  const n = 5 + (index % 4);
  const k = 2 + (index % 2);
  const combinations = choose(n, k);
  questions.push(mcq({
    id: qid(examNo, 'A', 10), module: 'A', points: 1,
    prompt: `Một nhóm có ${n} người. Có bao nhiêu cách chọn ${k} người vào một tiểu ban nếu không phân biệt thứ tự?`,
    correct: String(combinations),
    distractors: [String(n), String(n * (n - 1)), String(combinations + k), String(Math.max(1, combinations - 1))],
    explanation: `Số cách là C(${n},${k})=${combinations}.`,
    tags: ['combinations']
  }));

  const matrixSizes = [
    [2, 3, 3, 2], [3, 2, 2, 4], [2, 4, 4, 3], [3, 3, 3, 2], [2, 2, 2, 3],
    [4, 2, 2, 3], [2, 3, 3, 4], [3, 4, 4, 2], [2, 5, 5, 2], [3, 2, 2, 3]
  ][index];
  const [r1, c1, r2, c2] = matrixSizes;
  questions.push(mcq({
    id: qid(examNo, 'A', 11), module: 'A', points: 1,
    prompt: `Ma trận A có kích thước ${r1}×${c1}, ma trận B có kích thước ${r2}×${c2}. Kích thước của tích AB là:`,
    correct: `${r1}×${c2}`,
    distractors: [`${c1}×${r2}`, `${r2}×${c2}`, `${r1}×${c1}`],
    explanation: `Hai kích thước ở giữa đều bằng ${c1}; tích AB có kích thước ngoài là ${r1}×${c2}.`,
    tags: ['matrix-dimensions']
  }));

  const a = [[1 + (index % 2), 2], [index % 3, 1]];
  const b = [[2, 1 + (index % 3)], [1, 2]];
  const element12 = a[0][0] * b[0][1] + a[0][1] * b[1][1];
  questions.push(mcq({
    id: qid(examNo, 'A', 12), module: 'A', points: 1,
    prompt: `Cho A=[[${a[0]}],[${a[1]}]] và B=[[${b[0]}],[${b[1]}]]. Phần tử hàng 1, cột 2 của AB bằng:`,
    correct: String(element12),
    distractors: [String(element12 - 2), String(element12 - 1), String(element12 + 1)],
    explanation: `Lấy hàng 1 của A nhân cột 2 của B: ${a[0][0]}×${b[0][1]}+${a[0][1]}×${b[1][1]}=${element12}.`,
    tags: ['matrix-multiplication']
  }));

  const addA = 1 + index % 4;
  const addB = 2 + index % 3;
  questions.push(mcq({
    id: qid(examNo, 'A', 13), module: 'A', points: 1,
    prompt: `Cho A=[[${addA},2],[1,3]] và B=[[1,${addB}],[2,1]]. Phần tử hàng 1, cột 2 của A+B bằng:`,
    correct: String(2 + addB),
    distractors: [String(addB), String(2 * addB + 1), String(3 + addB), String(1 + addB)],
    explanation: `Cộng hai phần tử cùng vị trí: 2+${addB}=${2 + addB}.`,
    tags: ['matrix-addition']
  }));

  const scalar = 2 + index % 3;
  const scalarEntry = 1 + index % 4;
  questions.push(mcq({
    id: qid(examNo, 'A', 14), module: 'A', points: 1,
    prompt: `Cho A=[[1,${scalarEntry}],[2,3]]. Phần tử hàng 1, cột 2 của ${scalar}A bằng:`,
    correct: String(scalar * scalarEntry),
    distractors: [String(scalar + scalarEntry), String(scalarEntry), String(scalar * scalarEntry + 1)],
    explanation: `Nhân từng phần tử của A với ${scalar}: ${scalar}×${scalarEntry}=${scalar * scalarEntry}.`,
    tags: ['scalar-multiplication']
  }));

  const detA = 2 + index % 4;
  const detB = 1 + index % 2;
  const detC = 1 + index % 3;
  const detD = 2 + (index + 1) % 3;
  const determinant = detA * detD - detB * detC;
  questions.push(mcq({
    id: qid(examNo, 'A', 15), module: 'A', points: 1,
    prompt: `Định thức của ma trận [[${detA},${detB}],[${detC},${detD}]] bằng:`,
    correct: String(determinant),
    distractors: [String(detA * detD + detB * detC), String(detA + detD), String(determinant + 1)],
    explanation: `det = ${detA}×${detD}-${detB}×${detC}=${determinant}.`,
    tags: ['determinant']
  }));

  const inv = matrixInverseSets[index];
  const invDet = inv.a * inv.d - inv.b * inv.c;
  const inv12 = -inv.b / invDet;
  const invAnswer = Number.isInteger(inv12) ? String(inv12) : frac(-inv.b, invDet);
  questions.push(mcq({
    id: qid(examNo, 'A', 16), module: 'A', points: 1,
    prompt: `Cho A=[[${inv.a},${inv.b}],[${inv.c},${inv.d}]]. Phần tử hàng 1, cột 2 của A⁻¹ là:`,
    correct: invAnswer,
    distractors: [String(inv.b), String(-inv.b), String(inv.d)].filter((value) => value !== invAnswer),
    explanation: `A⁻¹=(1/${invDet})[[${inv.d},${-inv.b}],[${-inv.c},${inv.a}]], nên phần tử (1,2) là ${invAnswer}.`,
    tags: ['matrix-inverse']
  }));

  const t1 = 1 + index % 5;
  const t2 = 2 + index % 4;
  questions.push(mcq({
    id: qid(examNo, 'A', 17), module: 'A', points: 1,
    prompt: `Cho A=[[1,${t1},3],[4,${t2},6]]. Hàng thứ hai của Aᵀ là:`,
    correct: `[${t1},${t2}]`,
    distractors: ['[1,4]', '[3,6]', `[4,${t2},6]`],
    explanation: `Hàng thứ hai của Aᵀ chính là cột thứ hai của A: [${t1},${t2}].`,
    tags: ['transpose']
  }));

  const x = 2 + index % 3;
  const y = 1 + (index + 1) % 3;
  const sum = x + y;
  const diff = x - y;
  questions.push(mcq({
    id: qid(examNo, 'A', 18), module: 'A', points: 1,
    prompt: `Nghiệm của hệ x+y=${sum} và x-y=${diff} là:`,
    correct: `x=${x}, y=${y}`,
    distractors: [`x=${y}, y=${x}`, `x=${x + 1}, y=${y - 1}`, `x=${sum}, y=${diff}`],
    explanation: `Cộng hai phương trình được 2x=${2 * x}, nên x=${x}; sau đó y=${y}.`,
    tags: ['linear-system']
  }));

  const multiple = 2 + index % 3;
  questions.push(mcq({
    id: qid(examNo, 'A', 19), module: 'A', points: 1,
    prompt: `Hạng của ma trận [[1,${multiple}],[${multiple},${multiple ** 2}]] là:`,
    correct: '1',
    distractors: ['0', '2', String(multiple ** 2)],
    explanation: `Hàng thứ hai bằng ${multiple} lần hàng thứ nhất, nên chỉ có một hàng độc lập tuyến tính và rank bằng 1.`,
    tags: ['rank']
  }));

  const diag1 = 2 + index % 3;
  const diag2 = 3 + index % 4;
  const vec1 = 1 + index % 2;
  const vec2 = 2 + index % 3;
  questions.push(mcq({
    id: qid(examNo, 'A', 20), module: 'A', points: 1,
    prompt: `Cho A=[[${diag1},0],[0,${diag2}]] và vector x=[${vec1},${vec2}]ᵀ. Vector Ax bằng:`,
    correct: `[${diag1 * vec1},${diag2 * vec2}]ᵀ`,
    distractors: [`[${diag1 + vec1},${diag2 + vec2}]ᵀ`, `[${diag1 * vec2},${diag2 * vec1}]ᵀ`, `[${vec1},${vec2}]ᵀ`],
    explanation: `Ma trận chéo nhân từng thành phần tương ứng: [${diag1}×${vec1}, ${diag2}×${vec2}]ᵀ.`,
    tags: ['matrix-vector']
  }));

  return questions;
}
