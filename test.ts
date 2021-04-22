let Result: {[index: string]: number} = {};
let data = [
    "미어캣",
    "플라밍고",
    "벌새",
    "임팔라",
    "바다사자",
    "돌고래",
    "벌새",
    "돌고래",
    "담비",
    "고래",
    "쿼카",
    "임팔라",
    "바다사자",
    "미어캣",
    "플라밍고",
    "담비",
    "미어캣",
    "쿼카",
    "벌새",
    "플라밍고",
    "고래",
    "플라밍고",
    "쿼카",
    "유니콘"
]

for (const Elem of data) {
    if (Result[Elem] == undefined) {
        Result[Elem] = 1;
    } else {
        Result[Elem]++;
    }
}

let max = "";
for (const Elem in Result) {
    if (max == "") max = Elem;
    if (Result[max] < Result[Elem]) {
        max = Elem;
    }
}

console.log(Result, max);