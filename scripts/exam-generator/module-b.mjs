import { mcq, openQuestion, qid, gcd } from './shared.mjs';

const gcdPairs = [[252,105],[84,30],[48,18],[270,192],[144,60],[99,78],[128,48],[225,150],[119,34],[391,299]];

export function buildModuleB(examNo) {
  const index = examNo - 1;
  const questions = [];
  const [gA, gB] = gcdPairs[index];
  const g = gcd(gA, gB);
  questions.push(mcq({
    id: qid(examNo, 'B', 1), module: 'B', points: 1,
    prompt: `Ước chung lớn nhất của ${gA} và ${gB} theo thuật toán Euclid là:`,
    correct: String(g), distractors: [String(Math.max(1, g / 2)), String(g * 2), String(g + 1)],
    explanation: `Lặp phép chia lấy dư cho tới khi số dư bằng 0; số chia cuối cùng khác 0 là ${g}.`, tags: ['euclid', 'gcd']
  }));

  const firstRemainder = gA % gB;
  questions.push(mcq({
    id: qid(examNo, 'B', 2), module: 'B', points: 1,
    prompt: `Với phép gán Python \`a, b = b, a % b\`, bắt đầu từ a=${gA}, b=${gB}. Sau một lần lặp, (a,b) là:`,
    correct: `(${gB}, ${firstRemainder})`,
    distractors: [`(${gA}, ${firstRemainder})`, `(${firstRemainder}, ${gB})`, `(${gB}, ${g})`],
    explanation: `${gA} % ${gB} = ${firstRemainder}; phép gán đồng thời tạo (a,b)=(${gB},${firstRemainder}).`, tags: ['euclid', 'python']
  }));

  questions.push(mcq({
    id: qid(examNo, 'B', 3), module: 'B', points: 1,
    prompt: `Đoạn code sau trả về gì?\n\`\`\`python\ndef gcd(a, b):\n    return a if b == 0 else gcd(b, a % b)\n\nprint(gcd(${gA}, ${gB}))\n\`\`\``,
    correct: String(g), distractors: [String(gB), String(firstRemainder), String(gA + gB)],
    explanation: `Hàm đệ quy thực hiện thuật toán Euclid và trả về gcd=${g}.`, tags: ['euclid', 'recursion']
  }));

  questions.push(mcq({
    id: qid(examNo, 'B', 4), module: 'B', points: 1,
    prompt: `Độ phức tạp thời gian thường dùng để mô tả thuật toán Euclid là:`,
    correct: 'O(log(min(a,b)))', distractors: ['O(1)', 'O(a+b)', 'O(a×b)'],
    explanation: 'Số bước của thuật toán Euclid tăng theo logarit của số nhỏ hơn.', tags: ['euclid', 'complexity']
  }));

  questions.push(mcq({
    id: qid(examNo, 'B', 5), module: 'B', points: 1,
    prompt: `Cách gọi GET API bằng thư viện \`requests\` nào phù hợp khi cần truyền tham số \`q='ai'\` và giới hạn thời gian chờ?`,
    correct: "requests.get(url, params={'q': 'ai'}, timeout=5)",
    distractors: ["requests.get(url, data={'q': 'ai'})", "requests.get(url, verify=False)", "requests.get(url + 'q=ai')"],
    explanation: '`params` tạo query string đúng cách và `timeout` tránh chờ vô hạn.', tags: ['api', 'requests']
  }));

  questions.push(mcq({
    id: qid(examNo, 'B', 6), module: 'B', points: 1,
    prompt: `Sau khi nhận \`response\` từ \`requests\`, lệnh nào phát hiện mã HTTP 4xx hoặc 5xx bằng ngoại lệ?`,
    correct: 'response.raise_for_status()', distractors: ['response.close()', 'response.text()', 'response.ok()'],
    explanation: '`raise_for_status()` ném `HTTPError` nếu phản hồi là lỗi 4xx/5xx.', tags: ['api', 'http']
  }));

  questions.push(mcq({
    id: qid(examNo, 'B', 7), module: 'B', points: 1,
    prompt: `Nếu API trả JSON hợp lệ, cách phổ biến để chuyển nội dung phản hồi thành đối tượng Python là:`,
    correct: 'response.json()', distractors: ['response.to_dict()', 'eval(response.text)', 'json.loads(response)'],
    explanation: '`response.json()` phân tích thân phản hồi JSON; không dùng `eval` với dữ liệu mạng.', tags: ['api', 'json']
  }));

  questions.push(mcq({
    id: qid(examNo, 'B', 8), module: 'B', points: 1,
    prompt: `Cách quản lý API key phù hợp nhất là:`,
    correct: 'Đọc từ biến môi trường hoặc secret manager và gửi qua header theo tài liệu API',
    distractors: ['Ghi thẳng vào source rồi đẩy lên GitHub', 'Đưa key vào URL để dễ nhìn', 'In key ra log mỗi lần gọi'],
    explanation: 'Secret không nên nằm trong source, URL hoặc log.', tags: ['api', 'secrets']
  }));

  questions.push(mcq({
    id: qid(examNo, 'B', 9), module: 'B', points: 1,
    prompt: `Khi gọi API, khối \`try/except\` thường nên bắt nhóm lỗi nào của thư viện \`requests\`?`,
    correct: 'requests.RequestException', distractors: ['KeyboardInterrupt', 'ImportError', 'StopIteration'],
    explanation: '`RequestException` là lớp cơ sở cho các lỗi mạng phổ biến của Requests.', tags: ['api', 'error-handling']
  }));

  const statusQuestions = [
    ['401', 'Chưa xác thực hoặc thông tin xác thực không hợp lệ'],
    ['404', 'Không tìm thấy tài nguyên'],
    ['429', 'Gửi quá nhiều request trong thời gian ngắn'],
    ['500', 'Lỗi phía máy chủ']
  ];
  const [status, statusMeaning] = statusQuestions[index % statusQuestions.length];
  questions.push(mcq({
    id: qid(examNo, 'B', 10), module: 'B', points: 1,
    prompt: `Mã HTTP ${status} thường có ý nghĩa gần đúng nhất là:`,
    correct: statusMeaning,
    distractors: statusQuestions.filter(([code]) => code !== status).map(([, meaning]) => meaning),
    explanation: `HTTP ${status}: ${statusMeaning}.`, tags: ['api', 'http-status']
  }));

  questions.push(mcq({
    id: qid(examNo, 'B', 11), module: 'B', points: 1,
    prompt: `Cách gửi JSON body bằng POST với Requests là:`,
    correct: 'requests.post(url, json=payload, timeout=5)',
    distractors: ['requests.get(url, json=payload)', 'requests.post(url, params=payload) trong mọi trường hợp', 'requests.post(url, verify=False)'],
    explanation: 'Tham số `json=payload` mã hóa dữ liệu thành JSON và đặt content type phù hợp.', tags: ['api', 'post']
  }));

  questions.push(mcq({
    id: qid(examNo, 'B', 12), module: 'B', points: 1,
    prompt: `API dự kiến trả \`{"values": [1,2,3]}\`. Trước khi tính trung bình, code nên:`,
    correct: 'Kiểm tra status, JSON là object và values là danh sách số không rỗng',
    distractors: ['Tin rằng API luôn trả đúng schema', 'Dùng eval để ép kiểu', 'Chỉ kiểm tra độ dài chuỗi response'],
    explanation: 'Dữ liệu từ API cần được kiểm tra trước khi dùng để tránh lỗi kiểu và dữ liệu thiếu.', tags: ['api', 'validation']
  }));

  const shapeRows = 2 + index % 2;
  const shapeCols = 3 + index % 3;
  questions.push(mcq({
    id: qid(examNo, 'B', 13), module: 'B', points: 1,
    prompt: `Cho \`x = np.zeros((${shapeRows}, ${shapeCols}))\`. Giá trị của \`x.shape\` là:`,
    correct: `(${shapeRows}, ${shapeCols})`, distractors: [`(${shapeCols}, ${shapeRows})`, `(${shapeRows * shapeCols},)`, '2'],
    explanation: `Mảng có ${shapeRows} hàng và ${shapeCols} cột nên shape là (${shapeRows}, ${shapeCols}).`, tags: ['numpy', 'shape']
  }));

  const scalar = 2 + index % 4;
  questions.push(mcq({
    id: qid(examNo, 'B', 14), module: 'B', points: 1,
    prompt: `Kết quả của \`np.array([1, 2, 3]) + ${scalar}\` là:`,
    correct: `[${1 + scalar}, ${2 + scalar}, ${3 + scalar}]`,
    distractors: [`[${scalar}, ${2 * scalar}, ${3 * scalar}]`, `[1, 2, 3, ${scalar}]`, 'Lỗi broadcasting'],
    explanation: `Scalar ${scalar} được broadcast tới từng phần tử.`, tags: ['numpy', 'broadcasting']
  }));

  const row2 = [4 + index % 2, 5 + index % 2, 6 + index % 2];
  questions.push(mcq({
    id: qid(examNo, 'B', 15), module: 'B', points: 1,
    prompt: `Cho \`x = np.array([[1,2,3],[${row2.join(',')}]] )\`. Kết quả của \`x.sum(axis=0)\` là:`,
    correct: `[${1 + row2[0]}, ${2 + row2[1]}, ${3 + row2[2]}]`,
    distractors: [`[6, ${row2.reduce((a,b)=>a+b,0)}]`, String(6 + row2.reduce((a,b)=>a+b,0)), `[[${1 + row2[0]}],[${2 + row2[1]}],[${3 + row2[2]}]]`],
    explanation: '`axis=0` cộng theo từng cột.', tags: ['numpy', 'axis']
  }));

  const start = index % 2;
  questions.push(mcq({
    id: qid(examNo, 'B', 16), module: 'B', points: 1,
    prompt: `Cho \`x = np.arange(6).reshape(2,3)\`. Kết quả của \`x[:, ${start + 1}]\` là:`,
    correct: start === 0 ? '[1, 4]' : '[2, 5]',
    distractors: ['[0, 1, 2]', '[3, 4, 5]', start === 0 ? '[[1],[4]]' : '[[2],[5]]'],
    explanation: `Mảng là [[0,1,2],[3,4,5]]; chọn mọi hàng và cột chỉ số ${start + 1}.`, tags: ['numpy', 'slicing']
  }));

  const parity = index % 2 === 0 ? 0 : 1;
  questions.push(mcq({
    id: qid(examNo, 'B', 17), module: 'B', points: 1,
    prompt: `Cho \`x = np.array([1,2,3,4,5])\`. Kết quả của \`x[x % 2 == ${parity}]\` là:`,
    correct: parity === 0 ? '[2, 4]' : '[1, 3, 5]',
    distractors: parity === 0 ? ['[1, 3, 5]', '[False, True, False, True, False]', '6'] : ['[2, 4]', '[True, False, True, False, True]', '9'],
    explanation: `Boolean mask giữ các phần tử có phần dư bằng ${parity}.`, tags: ['numpy', 'boolean-indexing']
  }));

  const reshapeRows = index % 2 === 0 ? 2 : 3;
  const reshapeCols = 6 / reshapeRows;
  questions.push(mcq({
    id: qid(examNo, 'B', 18), module: 'B', points: 1,
    prompt: `Cho \`x = np.arange(6).reshape(${reshapeRows}, ${reshapeCols})\`. Giá trị của \`x.ndim\` là:`,
    correct: '2', distractors: ['1', '3', '6'],
    explanation: 'Sau reshape, x vẫn là mảng hai chiều nên ndim=2.', tags: ['numpy', 'reshape', 'ndim']
  }));

  questions.push(openQuestion({
    id: qid(examNo, 'B', 19), module: 'B', type: 'code', points: 5,
    prompt: `Viết hàm Python \`gcd(a, b)\` bằng thuật toán Euclid dùng vòng lặp. Hàm cần xử lý số nguyên âm bằng cách lấy trị tuyệt đối và trả về ước chung lớn nhất. Giải thích ngắn từng bước với ví dụ gcd(${gA}, ${gB}).`,
    modelAnswer: `\`\`\`python\ndef gcd(a: int, b: int) -> int:\n    a, b = abs(a), abs(b)\n    while b != 0:\n        a, b = b, a % b\n    return a\n\nprint(gcd(${gA}, ${gB}))  # ${g}\n\`\`\`\nMỗi vòng lặp thay cặp (a,b) bằng (b,a%b). Khi b=0, a là ước chung lớn nhất.`,
    rubric: ['Có abs để xử lý số âm.', 'Có vòng lặp đến khi b=0.', 'Phép cập nhật dùng b và a%b.', `Ví dụ trả đúng ${g}.`],
    tags: ['euclid', 'python', 'code']
  }));

  if (examNo % 2 === 0) {
    questions.push(openQuestion({
      id: qid(examNo, 'B', 20), module: 'B', type: 'code', points: 5,
      prompt: `Viết hàm Python \`fetch_average(url)\`:\n- Gọi GET bằng \`requests\` với timeout 5 giây.\n- Gọi \`raise_for_status()\`.\n- API trả JSON dạng \`{"values": [số, ...]}\`.\n- Kiểm tra \`values\` là danh sách không rỗng, rồi dùng NumPy trả về trung bình dạng float.\nKhông cần thêm retry, cache hay kiến trúc phức tạp.`,
      modelAnswer: `\`\`\`python\nimport requests\nimport numpy as np\n\ndef fetch_average(url: str) -> float:\n    response = requests.get(url, timeout=5)\n    response.raise_for_status()\n    data = response.json()\n    values = data.get('values') if isinstance(data, dict) else None\n    if not isinstance(values, list) or not values:\n        raise ValueError('values must be a non-empty list')\n    return float(np.mean(np.asarray(values, dtype=float)))\n\`\`\``,
      rubric: ['Dùng requests.get với timeout=5.', 'Gọi raise_for_status và response.json.', 'Kiểm tra values là list không rỗng.', 'Dùng NumPy và trả float.'],
      tags: ['api', 'numpy', 'code']
    }));
  } else {
    const offset = index % 3;
    questions.push(openQuestion({
      id: qid(examNo, 'B', 20), module: 'B', type: 'code', points: 5,
      prompt: `Không chạy máy, hãy giải thích giá trị và shape của các biến trong đoạn code:\n\`\`\`python\nimport numpy as np\nx = np.array([[${1+offset}, ${2+offset}, ${3+offset}],\n              [${4+offset}, ${5+offset}, ${6+offset}]])\ny = x[:, 1:]\nz = y.mean(axis=0)\nm = x[x % 2 == 0]\n\`\`\`\nNêu vì sao \`m\` là mảng một chiều.`,
      modelAnswer: `- x có shape (2,3).\n- y lấy mọi hàng và hai cột cuối, nên y=[[${2+offset},${3+offset}],[${5+offset},${6+offset}]], shape (2,2).\n- z là trung bình từng cột của y, shape (2,).\n- m chứa các phần tử chẵn của x và có shape (k,), vì boolean indexing theo phần tử gom kết quả thành mảng một chiều.`,
      rubric: ['Nêu đúng shape của x.', 'Nêu đúng phép cắt và shape của y.', 'Giải thích axis=0 cho z.', 'Giải thích boolean indexing tạo mảng một chiều.'],
      tags: ['numpy', 'code-reading']
    }));
  }
  return questions;
}
