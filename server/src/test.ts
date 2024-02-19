import executeCodeInSandbox from "./utils/sandbox";

const code = `
function sum(a, b) {
    return a + b;
}
const val = sum(2, 3);
console.log(val);
`;

executeCodeInSandbox({require}, code).then((r)=>{
    console.log("result", r);
}).catch((err)=>{
    console.error("err", err);
});