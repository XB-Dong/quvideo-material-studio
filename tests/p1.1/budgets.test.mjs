import {test} from 'node:test';import assert from 'node:assert/strict';import {evaluateBudgets,assertBudgets} from './budgets.mjs';
const run=(image=819200,js=192215)=>({run:1,imageEncodedBytes:image,scriptNormalizedGzipBytes:js,metrics:{cls:.1},errors:[]});
test('exact frozen limits accepted',()=>assertBudgets(evaluateBudgets({runs:[run()]})));
test('single heavy run fails despite lower other runs',()=>{const result=evaluateBudgets({runs:[run(100),run(819201),run(100)]});assert(!result.pass);assert.throws(()=>assertBudgets(result));});
test('new JS cannot exceed fixed P0+35KiB',()=>assert(!evaluateBudgets({runs:[run(100,192216)]}).pass));
test('request failures are not hidden by numeric budget',()=>{const r=run();r.errors=['error'];assert(!evaluateBudgets({runs:[r]}).pass)});
