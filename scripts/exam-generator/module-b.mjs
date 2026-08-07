import { mcq, openQuestion, qid, gcd, formatNumber, matrixToText } from './shared.mjs';

const GCD_PAIRS = [[252, 105], [84, 30], [48, 18], [270, 192], [391, 299]];

function euclidTrace(a, b) {
  const steps = [];
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    steps.push(`${x}=${Math.floor(x / y)}×${y}+${x % y}`);
    [x, y] = [y, x % y];
  }
  return { value: x, steps };
}

const mcqFactories = {
  gcdValue(examNo, id) {
    const [a, b] = GCD_PAIRS[examNo - 1];
    const value = gcd(a, b);
    return mcq({
      id, module: 'B', points: 1,
      prompt: `Ước chung lớn nhất của ${a} và ${b} theo thuật toán Euclid là:`,
      correct: String(value),
      distractors: [String(Math.max(1, value / 2)), String(value * 2), String(value + 1)],
      explanation: `Lặp phép chia lấy dư đến khi số dư bằng 0; ước chung lớn nhất là ${value}.`,
      tags: ['euclid', 'gcd'], skillId: 'euclid.compute-gcd'
    });
  },
  oneIteration(examNo, id) {
    const [a, b] = GCD_PAIRS[examNo - 1];
    const remainder = a % b;
    return mcq({
      id, module: 'B', points: 1,
      prompt: `Với phép gán Python \`a, b = b, a % b\`, bắt đầu từ a=${a}, b=${b}. Sau một lần lặp, (a,b) là:`,
      correct: `(${b}, ${remainder})`,
      distractors: [`(${a}, ${remainder})`, `(${remainder}, ${b})`, `(${b}, ${gcd(a, b)})`],
      explanation: `${a}%${b}=${remainder}; phép gán đồng thời tạo (a,b)=(${b},${remainder}).`,
      tags: ['euclid', 'python'], skillId: 'euclid.trace-one-iteration'
    });
  },
  recursionOutput(examNo, id) {
    const [a, b] = GCD_PAIRS[examNo - 1];
    const value = gcd(a, b);
    return mcq({
      id, module: 'B', points: 1,
      prompt: `Đoạn code sau in ra gì?\n\`\`\`python\ndef gcd(a, b):\n    return a if b == 0 else gcd(b, a % b)\n\nprint(gcd(${a}, ${b}))\n\`\`\``,
      correct: String(value),
      distractors: [String(a), String(b), String(a % b)],
      explanation: `Hàm đệ quy thực hiện thuật toán Euclid và trả về ${value}.`,
      tags: ['euclid', 'recursion'], skillId: 'euclid.read-recursive-code'
    });
  },
  traceEuclid(examNo, id) {
    const [a, b] = GCD_PAIRS[examNo - 1];
    const { value, steps } = euclidTrace(a, b);
    return mcq({
      id, module: 'B', points: 1,
      prompt: `Khi áp dụng Euclid cho (${a}, ${b}), dãy số chia khác 0 kết thúc bằng số nào?`,
      correct: String(value),
      distractors: [String(b), String(a % b), String(Math.floor(a / b))],
      explanation: `${steps.join('; ')}. Số chia cuối cùng khác 0 là ${value}.`,
      tags: ['euclid', 'trace'], skillId: 'euclid.trace-full-process'
    });
  },
  bugEuclidZero(examNo, id) {
    const variants = [
      ['while b == 0:', 'while b != 0:'],
      ['a, b = a % b, b', 'a, b = b, a % b'],
      ['return b', 'return a'],
      ['a = abs(a)', 'a, b = abs(a), abs(b)'],
      ['while a != 0:', 'while b != 0:']
    ];
    const [wrong, correct] = variants[examNo - 1];
    return mcq({
      id, module: 'B', points: 1,
      prompt: `Trong một hàm Euclid dùng vòng lặp, dòng \`${wrong}\` là lỗi chính. Cách sửa phù hợp nhất là:`,
      correct: correct,
      distractors: ['break', 'return 0', 'a = b = 1'],
      explanation: `Thuật toán phải tiếp tục khi b khác 0 và cập nhật đúng cặp (b,a%b); khi kết thúc, a là GCD.`,
      tags: ['euclid', 'debugging'], skillId: 'euclid.debug-loop'
    });
  },
  negativeGcd(examNo, id) {
    const [a, b] = GCD_PAIRS[examNo - 1];
    const value = gcd(-a, b);
    return mcq({
      id, module: 'B', points: 1,
      prompt: `Một hàm gcd xử lý số âm bằng \`a, b = abs(a), abs(b)\`. Kết quả \`gcd(-${a}, ${b})\` là:`,
      correct: String(value),
      distractors: [String(-value), String(a), String(b)],
      explanation: `Lấy trị tuyệt đối trước rồi chạy Euclid, nên kết quả không âm và bằng ${value}.`,
      tags: ['euclid', 'python'], skillId: 'euclid.handle-negative-inputs'
    });
  },
  complexity(examNo, id) {
    return mcq({
      id, module: 'B', points: 1,
      prompt: 'Độ phức tạp thời gian thường dùng để mô tả thuật toán Euclid là:',
      correct: 'O(log(min(a,b)))',
      distractors: ['O(1)', 'O(a+b)', 'O(a×b)'],
      explanation: 'Số bước của thuật toán Euclid tăng theo logarit của số nhỏ hơn.',
      tags: ['euclid', 'complexity'], skillId: 'euclid.time-complexity'
    });
  },
  getParamsTimeout(examNo, id) {
    const timeout = 3 + examNo;
    return mcq({
      id, module: 'B', points: 1,
      prompt: `Cách gọi GET API bằng \`requests\` nào đúng khi cần truyền tham số \`q='ai'\` và timeout ${timeout} giây?`,
      correct: `requests.get(url, params={'q': 'ai'}, timeout=${timeout})`,
      distractors: ["requests.get(url, data={'q': 'ai'})", `requests.get(url, timeout=None)`, "requests.get(url + 'q=ai')"],
      explanation: '`params` tạo query string đúng cách; `timeout` giới hạn thời gian chờ.',
      tags: ['api', 'requests'], skillId: 'api.requests.get-params-timeout'
    });
  },
  postJson(examNo, id) {
    const timeout = 4 + examNo;
    return mcq({
      id, module: 'B', points: 1,
      prompt: `Cách gửi dictionary \`payload\` dưới dạng JSON bằng POST và timeout ${timeout} giây là:`,
      correct: `requests.post(url, json=payload, timeout=${timeout})`,
      distractors: ['requests.get(url, json=payload)', 'requests.post(url, params=payload)', 'requests.post(url, data=str(payload)) trong mọi trường hợp'],
      explanation: '`json=payload` mã hóa body JSON và đặt Content-Type phù hợp.',
      tags: ['api', 'requests', 'post'], skillId: 'api.requests.post-json'
    });
  },
  authHeader(examNo, id) {
    return mcq({
      id, module: 'B', points: 1,
      prompt: 'Nếu API yêu cầu Bearer token, cách truyền token phù hợp nhất là:',
      correct: `headers={'Authorization': f'Bearer {token}'}`,
      distractors: ["params={'token': token} trong mọi trường hợp", "print(token) rồi gọi API", "url = url + token"],
      explanation: 'Token thường được gửi trong header Authorization theo tài liệu API và không nên xuất hiện trong log hoặc URL.',
      tags: ['api', 'authorization'], skillId: 'api.auth.bearer-header'
    });
  },
  raiseStatus(examNo, id) {
    return mcq({
      id, module: 'B', points: 1,
      prompt: 'Sau khi nhận `response` từ Requests, lệnh nào phát hiện mã HTTP 4xx hoặc 5xx bằng ngoại lệ?',
      correct: 'response.raise_for_status()',
      distractors: ['response.close()', 'response.text()', 'response.ok()'],
      explanation: '`raise_for_status()` ném `HTTPError` khi phản hồi là lỗi 4xx/5xx.',
      tags: ['api', 'http'], skillId: 'api.http.raise-for-status'
    });
  },
  responseJson(examNo, id) {
    return mcq({
      id, module: 'B', points: 1,
      prompt: 'Nếu API trả JSON hợp lệ, cách phổ biến để chuyển nội dung phản hồi thành đối tượng Python là:',
      correct: 'response.json()',
      distractors: ['response.to_dict()', 'eval(response.text)', 'json.loads(response)'],
      explanation: '`response.json()` phân tích thân phản hồi JSON; không dùng `eval` với dữ liệu mạng.',
      tags: ['api', 'json'], skillId: 'api.response.parse-json'
    });
  },
  safeKey(examNo, id) {
    return mcq({
      id, module: 'B', points: 1,
      prompt: 'Cách quản lý API key phù hợp nhất trong một bài Python là:',
      correct: 'Đọc từ biến môi trường và không in key ra log',
      distractors: ['Ghi thẳng key vào source rồi đẩy lên GitHub', 'Đưa key vào URL để dễ nhìn', 'Ghi key vào câu trả lời lỗi'],
      explanation: 'API key không nên nằm trong source, URL hoặc log.',
      tags: ['api', 'secrets'], skillId: 'api.secret.basic-handling'
    });
  },
  requestException(examNo, id) {
    return mcq({
      id, module: 'B', points: 1,
      prompt: 'Khi gọi API, khối `try/except` thường có thể bắt lớp lỗi cơ sở nào của thư viện Requests?',
      correct: 'requests.RequestException',
      distractors: ['KeyboardInterrupt', 'ImportError', 'StopIteration'],
      explanation: '`RequestException` là lớp cơ sở cho các lỗi mạng phổ biến của Requests.',
      tags: ['api', 'error-handling'], skillId: 'api.requests.exception-handling'
    });
  },
  statusMeaning(examNo, id) {
    const statusQuestions = [
      ['401', 'Chưa xác thực hoặc thông tin xác thực không hợp lệ'],
      ['404', 'Không tìm thấy tài nguyên'],
      ['429', 'Gửi quá nhiều request trong thời gian ngắn'],
      ['500', 'Lỗi phía máy chủ'],
      ['201', 'Tạo tài nguyên thành công']
    ];
    const [status, meaning] = statusQuestions[examNo - 1];
    return mcq({
      id, module: 'B', points: 1,
      prompt: `Mã HTTP ${status} thường có ý nghĩa gần đúng nhất là:`,
      correct: meaning,
      distractors: statusQuestions.filter(([code]) => code !== status).slice(0, 3).map(([, text]) => text),
      explanation: `HTTP ${status}: ${meaning}.`,
      tags: ['api', 'http-status'], skillId: `api.http.status-${status}`
    });
  },
  schemaValidation(examNo, id) {
    const field = ['values', 'scores', 'items', 'predictions', 'data'][examNo - 1];
    return mcq({
      id, module: 'B', points: 1,
      prompt: `API dự kiến trả \`{"${field}": [1,2,3]}\`. Trước khi tính toán, code nên:`,
      correct: `Kiểm tra status, JSON là object và ${field} là danh sách số không rỗng`,
      distractors: ['Tin rằng API luôn trả đúng schema', 'Dùng eval để ép kiểu', 'Chỉ kiểm tra độ dài chuỗi response'],
      explanation: 'Dữ liệu từ API cần được xác thực trước khi dùng để tránh lỗi kiểu, thiếu trường hoặc danh sách rỗng.',
      tags: ['api', 'validation'], skillId: 'api.response.schema-validation'
    });
  },
  queryVsBody(examNo, id) {
    return mcq({
      id, module: 'B', points: 1,
      prompt: 'Nhận xét nào đúng nhất về `params=` và `json=` trong Requests?',
      correct: '`params=` tạo query string; `json=` tạo JSON request body',
      distractors: ['Hai tham số luôn giống hệt nhau', '`params=` chỉ dùng cho POST', '`json=` tự động đọc response JSON'],
      explanation: '`params` thuộc URL query; `json` mã hóa body gửi đi.',
      tags: ['api', 'requests'], skillId: 'api.requests.params-vs-json'
    });
  },
  missingField(examNo, id) {
    const field = ['score', 'label', 'result', 'probability', 'value'][examNo - 1];
    return mcq({
      id, module: 'B', points: 1,
      prompt: `Sau \`payload = response.json()\`, cách đọc trường bắt buộc \`${field}\` an toàn hơn là:`,
      correct: `Kiểm tra payload là dict và '${field}' tồn tại trước khi sử dụng`,
      distractors: [`Luôn dùng payload['${field}'] mà không kiểm tra`, 'Dùng eval(payload)', 'Chuyển toàn bộ payload thành chuỗi'],
      explanation: 'Phản hồi bên ngoài có thể thiếu trường hoặc sai kiểu, nên cần kiểm tra trước khi dùng.',
      tags: ['api', 'validation'], skillId: 'api.response.required-field'
    });
  },
  shape(examNo, id) {
    const rows = 2 + (examNo % 2);
    const cols = 3 + (examNo % 3);
    return mcq({
      id, module: 'B', points: 1,
      prompt: `Cho \`x = np.zeros((${rows}, ${cols}))\`. Giá trị của \`x.shape\` là:`,
      correct: `(${rows}, ${cols})`,
      distractors: [`(${cols}, ${rows})`, `(${rows * cols},)`, '2'],
      explanation: `Mảng có ${rows} hàng và ${cols} cột nên shape là (${rows}, ${cols}).`,
      tags: ['numpy', 'shape'], skillId: 'numpy.shape.read'
    });
  },
  scalarBroadcast(examNo, id) {
    const scalar = examNo + 1;
    return mcq({
      id, module: 'B', points: 1,
      prompt: `Kết quả của \`np.array([1, 2, 3]) + ${scalar}\` là:`,
      correct: `[${1 + scalar}, ${2 + scalar}, ${3 + scalar}]`,
      distractors: [`[${scalar}, ${2 * scalar}, ${3 * scalar}]`, `[1, 2, 3, ${scalar}]`, 'Lỗi broadcasting'],
      explanation: `Scalar ${scalar} được broadcast tới từng phần tử.`,
      tags: ['numpy', 'broadcasting'], skillId: 'numpy.broadcast.scalar'
    });
  },
  vectorBroadcast(examNo, id) {
    const offset = examNo;
    const answer = `[[${1 + offset},${2 + offset},${3 + offset}],[${4 + offset},${5 + offset},${6 + offset}]]`;
    return mcq({
      id, module: 'B', points: 1,
      prompt: `Cho \`x=np.array([[1,2,3],[4,5,6]])\` và \`v=np.array([${offset},${offset},${offset}])\`. Kết quả \`x+v\` là:`,
      correct: answer,
      distractors: ['Lỗi vì shape khác nhau', `[[${1 + offset},2,3],[${4 + offset},5,6]]`, `[[1,2,3],[4,5,6],[${offset},${offset},${offset}]]`],
      explanation: 'Vector shape (3,) được broadcast theo từng hàng của ma trận shape (2,3).',
      tags: ['numpy', 'broadcasting'], skillId: 'numpy.broadcast.row-vector'
    });
  },
  sumAxis0(examNo, id) {
    const delta = examNo - 1;
    const row2 = [4 + delta, 5 + delta, 6 + delta];
    const answer = `[${1 + row2[0]}, ${2 + row2[1]}, ${3 + row2[2]}]`;
    return mcq({
      id, module: 'B', points: 1,
      prompt: `Cho \`x=np.array([[1,2,3],[${row2.join(',')}]] )\`. Kết quả \`x.sum(axis=0)\` là:`,
      correct: answer,
      distractors: [`[6, ${row2.reduce((a, b) => a + b, 0)}]`, String(6 + row2.reduce((a, b) => a + b, 0)), `[[${1 + row2[0]}],[${2 + row2[1]}],[${3 + row2[2]}]]`],
      explanation: '`axis=0` gộp theo hàng và trả tổng từng cột.',
      tags: ['numpy', 'axis'], skillId: 'numpy.axis.sum-zero'
    });
  },
  meanAxis1(examNo, id) {
    const a = examNo;
    const matrix = [[a, a + 2], [a + 4, a + 6]];
    const answer = `[${a + 1}, ${a + 5}]`;
    return mcq({
      id, module: 'B', points: 1,
      prompt: `Cho \`x=np.array(${matrixToText(matrix)})\`. Kết quả \`x.mean(axis=1)\` là:`,
      correct: answer,
      distractors: [`[${a + 2}, ${a + 4}]`, String(a + 3), `[[${a + 1}],[${a + 5}]]`],
      explanation: '`axis=1` tính trung bình trên từng hàng.',
      tags: ['numpy', 'axis', 'mean'], skillId: 'numpy.axis.mean-one'
    });
  },
  sliceColumn1d(examNo, id) {
    const column = examNo % 3;
    const values = [column, column + 3];
    return mcq({
      id, module: 'B', points: 1,
      prompt: `Cho \`x=np.arange(6).reshape(2,3)\`. Kết quả \`x[:, ${column}]\` là:`,
      correct: `[${values.join(', ')}]`,
      distractors: [`[[${values[0]}],[${values[1]}]]`, '[0, 1, 2]', '[3, 4, 5]'],
      explanation: `Chọn mọi hàng và một cột bằng chỉ số nguyên tạo mảng một chiều [${values.join(', ')}].`,
      tags: ['numpy', 'slicing'], skillId: 'numpy.slice.column-one-dimensional'
    });
  },
  sliceColumn2d(examNo, id) {
    const column = examNo % 3;
    const values = [column, column + 3];
    return mcq({
      id, module: 'B', points: 1,
      prompt: `Cho \`x=np.arange(6).reshape(2,3)\`. Kết quả \`x[:, ${column}:${column + 1}]\` có giá trị và shape nào?`,
      correct: `[[${values[0]}],[${values[1]}]], shape (2,1)`,
      distractors: [`[${values.join(',')}], shape (2,)`, 'shape (1,2)', 'Lỗi slicing'],
      explanation: 'Dùng slice giữ lại chiều cột, nên kết quả có shape (2,1).',
      tags: ['numpy', 'slicing', 'shape'], skillId: 'numpy.slice.column-two-dimensional'
    });
  },
  booleanMask(examNo, id) {
    const parity = examNo % 2;
    return mcq({
      id, module: 'B', points: 1,
      prompt: `Cho \`x=np.array([1,2,3,4,5])\`. Kết quả \`x[x % 2 == ${parity}]\` là:`,
      correct: parity === 0 ? '[2, 4]' : '[1, 3, 5]',
      distractors: parity === 0 ? ['[1, 3, 5]', '[False, True, False, True, False]', '6'] : ['[2, 4]', '[True, False, True, False, True]', '9'],
      explanation: `Boolean mask giữ các phần tử có phần dư bằng ${parity}.`,
      tags: ['numpy', 'boolean-indexing'], skillId: 'numpy.boolean-indexing.parity'
    });
  },
  reshapeNdim(examNo, id) {
    const rows = examNo % 2 === 0 ? 3 : 2;
    const cols = 6 / rows;
    return mcq({
      id, module: 'B', points: 1,
      prompt: `Cho \`x=np.arange(6).reshape(${rows},${cols})\`. Giá trị \`x.ndim\` là:`,
      correct: '2',
      distractors: ['1', '3', '6'],
      explanation: 'Sau reshape, x là mảng hai chiều nên ndim=2.',
      tags: ['numpy', 'reshape', 'ndim'], skillId: 'numpy.reshape.ndim'
    });
  }
};

function codeQuestion(skill, examNo, id) {
  const [a, b] = GCD_PAIRS[examNo - 1];
  const value = gcd(a, b);
  if (skill === 'gcdLoop') {
    return openQuestion({
      id, module: 'B', type: 'code', points: 5,
      prompt: `Viết hàm Python \`gcd(a,b)\` bằng thuật toán Euclid dùng vòng lặp. Hàm xử lý số âm bằng trị tuyệt đối. Giải thích ngắn với ví dụ gcd(${a},${b}).`,
      modelAnswer: `\`\`\`python\ndef gcd(a: int, b: int) -> int:\n    a, b = abs(a), abs(b)\n    while b != 0:\n        a, b = b, a % b\n    return a\n\nprint(gcd(${a}, ${b}))  # ${value}\n\`\`\`\nMỗi vòng thay (a,b) bằng (b,a%b). Khi b=0, a là GCD.`,
      rubric: ['Có abs cho số âm.', 'Lặp đến khi b=0.', 'Cập nhật đúng a,b=b,a%b.', `Ví dụ trả ${value}.`],
      tags: ['euclid', 'python'], skillId: 'euclid.code.loop-implementation'
    });
  }
  if (skill === 'fixGcd') {
    return openQuestion({
      id, module: 'B', type: 'code', points: 5,
      prompt: `Đoạn code sau sai:\n\`\`\`python\ndef gcd(a,b):\n    while b == 0:\n        a, b = a % b, b\n    return b\n\`\`\`\nHãy sửa thành hàm Euclid đúng, xử lý số âm và giải thích ba lỗi chính. Kiểm tra với (${a},${b}).`,
      modelAnswer: `\`\`\`python\ndef gcd(a,b):\n    a, b = abs(a), abs(b)\n    while b != 0:\n        a, b = b, a % b\n    return a\n\`\`\`\nBa lỗi: điều kiện vòng lặp bị đảo, phép cập nhật sai thứ tự, và phải trả a khi b=0. Kết quả là ${value}.`,
      rubric: ['Sửa while b != 0.', 'Sửa a,b=b,a%b.', 'Trả a.', 'Có abs và ví dụ đúng.'],
      tags: ['euclid', 'debugging'], skillId: 'euclid.code.debug-implementation'
    });
  }
  if (skill === 'traceGcd') {
    const trace = euclidTrace(a, b);
    return openQuestion({
      id, module: 'B', type: 'code', points: 5,
      prompt: `Không cần chạy máy, hãy ghi từng cặp (a,b) của thuật toán Euclid khi bắt đầu từ (${a},${b}) cho đến khi dừng; sau đó viết hàm Python tương ứng.`,
      modelAnswer: `Các phép chia: ${trace.steps.join('; ')}. Kết quả GCD=${value}.\n\`\`\`python\ndef gcd(a,b):\n    a,b=abs(a),abs(b)\n    while b:\n        a,b=b,a%b\n    return a\n\`\`\``,
      rubric: ['Theo dõi đúng các bước.', `Kết luận GCD=${value}.`, 'Code vòng lặp đúng.', 'Giải thích điều kiện dừng.'],
      tags: ['euclid', 'trace', 'python'], skillId: 'euclid.code.trace-and-implement'
    });
  }
  if (skill === 'explainNumpy') {
    const offset = examNo;
    return openQuestion({
      id, module: 'B', type: 'code', points: 5,
      prompt: `Giải thích giá trị và shape của x, y, z, m mà không chạy code:\n\`\`\`python\nimport numpy as np\nx=np.array([[1,2,3],[${4 + offset},${5 + offset},${6 + offset}]])\ny=x[:,1:]\nz=y.mean(axis=0)\nm=x[x%2==0]\n\`\`\``,
      modelAnswer: `x shape (2,3). y lấy mọi hàng và hai cột cuối, shape (2,2). z là trung bình theo cột của y, shape (2,). m lấy các phần tử chẵn bằng boolean indexing và trở thành mảng 1 chiều.`,
      rubric: ['Đúng shape x.', 'Đúng giá trị/shape y.', 'Giải thích axis=0 của z.', 'Giải thích boolean indexing tạo mảng 1 chiều.'],
      tags: ['numpy', 'code-reading'], skillId: 'numpy.code.explain-slice-mean-mask'
    });
  }
  if (skill === 'explainNumpyShapes') {
    return openQuestion({
      id, module: 'B', type: 'code', points: 5,
      prompt: `Không chạy code, hãy nêu giá trị và shape:\n\`\`\`python\nimport numpy as np\nx=np.arange(12).reshape(3,4)\na=x[:,2]\nb=x[:,2:3]\nc=x.mean(axis=1)\n\`\`\`\nGiải thích vì sao a và b chứa cùng cột nhưng shape khác nhau.`,
      modelAnswer: `x=[[0,1,2,3],[4,5,6,7],[8,9,10,11]], shape (3,4). a=[2,6,10], shape (3,). b=[[2],[6],[10]], shape (3,1). c=[1.5,5.5,9.5], shape (3,). Chỉ số nguyên bỏ chiều cột, slice giữ chiều.`,
      rubric: ['Đúng x.', 'Đúng a và shape.', 'Đúng b và shape.', 'Đúng c và giải thích axis=1.', 'Giải thích integer index và slice.'],
      tags: ['numpy', 'shape', 'slicing'], skillId: 'numpy.code.compare-integer-and-slice'
    });
  }
  if (skill === 'fetchAverage') {
    return openQuestion({
      id, module: 'B', type: 'code', points: 5,
      prompt: `Viết hàm \`fetch_average(url, token)\`: gọi GET bằng Requests, gửi Bearer token trong header, timeout 5 giây, phát hiện HTTP error, kiểm tra JSON có danh sách số không rỗng ở trường \`scores\`, rồi dùng NumPy trả trung bình dạng float. Schema sai phải raise ValueError.`,
      modelAnswer: `\`\`\`python\nimport requests\nimport numpy as np\n\ndef fetch_average(url, token):\n    response=requests.get(url, headers={'Authorization': f'Bearer {token}'}, timeout=5)\n    response.raise_for_status()\n    payload=response.json()\n    scores=payload.get('scores') if isinstance(payload, dict) else None\n    if not isinstance(scores, list) or not scores or any(isinstance(v,bool) or not isinstance(v,(int,float)) for v in scores):\n        raise ValueError('scores must be a non-empty numeric list')\n    return float(np.asarray(scores,dtype=float).mean())\n\`\`\``,
      rubric: ['GET, header và timeout đúng.', 'Có raise_for_status và response.json.', 'Kiểm tra schema/dữ liệu số.', 'Dùng NumPy và trả float.', 'Không log token.'],
      tags: ['api', 'numpy', 'code'], skillId: 'api.code.fetch-validate-average'
    });
  }
  if (skill === 'debugApi') {
    return openQuestion({
      id, module: 'B', type: 'code', points: 5,
      prompt: `Sửa đoạn code sau và giải thích lỗi:\n\`\`\`python\ndef get_score(url):\n    r=requests.get(url)\n    data=eval(r.text)\n    return data['score']\n\`\`\`\nYêu cầu: timeout, phát hiện HTTP error, đọc JSON an toàn, kiểm tra score là số và xử lý lỗi Requests ở mức cơ bản.`,
      modelAnswer: `\`\`\`python\nimport requests\n\ndef get_score(url):\n    try:\n        r=requests.get(url, timeout=5)\n        r.raise_for_status()\n        data=r.json()\n    except requests.RequestException as exc:\n        raise RuntimeError('API request failed') from exc\n    score=data.get('score') if isinstance(data,dict) else None\n    if isinstance(score,bool) or not isinstance(score,(int,float)):\n        raise ValueError('invalid score')\n    return float(score)\n\`\`\`\nKhông dùng eval với dữ liệu mạng; thêm timeout, status check và schema validation.`,
      rubric: ['Có timeout.', 'Có raise_for_status.', 'Không dùng eval.', 'Bắt RequestException.', 'Kiểm tra score là số.'],
      tags: ['api', 'debugging'], skillId: 'api.code.debug-unsafe-request'
    });
  }
  if (skill === 'integratedApiNumpy') {
    return openQuestion({
      id, module: 'B', type: 'code', points: 5,
      prompt: `Viết hàm \`fetch_pass_rate(url)\`: GET API với timeout 5 giây; JSON dạng \`{"scores":[...] }\`; kiểm tra danh sách số không rỗng; dùng NumPy tính tỷ lệ phần tử >=50 và trả float trong [0,1]. Nêu một lỗi có thể xảy ra và cách xử lý.`,
      modelAnswer: `\`\`\`python\nimport requests\nimport numpy as np\n\ndef fetch_pass_rate(url):\n    r=requests.get(url, timeout=5)\n    r.raise_for_status()\n    payload=r.json()\n    scores=payload.get('scores') if isinstance(payload,dict) else None\n    if not isinstance(scores,list) or not scores or any(isinstance(v,bool) or not isinstance(v,(int,float)) for v in scores):\n        raise ValueError('invalid scores')\n    values=np.asarray(scores,dtype=float)\n    return float((values>=50).mean())\n\`\`\`\nCó thể bắt requests.RequestException ở tầng gọi hoặc chuyển thành lỗi ứng dụng rõ ràng.`,
      rubric: ['GET và timeout.', 'Status/JSON/schema validation.', 'Dùng boolean mask NumPy.', 'Trả float đúng.', 'Nêu lỗi và cách xử lý.'],
      tags: ['api', 'numpy', 'code'], skillId: 'api-numpy.code.fetch-pass-rate'
    });
  }
  throw new Error(`Không có câu code Module B: ${skill}`);
}

export function buildModuleB(examNo, blueprint) {
  const questions = blueprint.bMcq.map((skill, index) => {
    const factory = mcqFactories[skill];
    if (!factory) throw new Error(`Không có factory Module B: ${skill}`);
    return factory(examNo, qid(examNo, 'B', index + 1));
  });
  blueprint.bOpen.forEach((skill, index) => {
    questions.push(codeQuestion(skill, examNo, qid(examNo, 'B', 19 + index)));
  });
  return questions;
}
