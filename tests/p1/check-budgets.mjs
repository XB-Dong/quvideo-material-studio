import fs from 'node:fs/promises';
import {evaluateBudgets,assertBudgets,FROZEN_P0_JS_GZIP_BYTES} from './budgets.mjs';
const report=JSON.parse(await fs.readFile(process.argv[2],'utf8'));
const evaluation={testedCommit:report.testedCommit,evaluatedAt:new Date().toISOString(),sourceReport:process.argv[2],...evaluateBudgets(report,Number(process.env.BASELINE_JS_GZIP_BYTES??FROZEN_P0_JS_GZIP_BYTES))};
if(process.argv[3])await fs.writeFile(process.argv[3],JSON.stringify(evaluation,null,2));
console.log(JSON.stringify(evaluation,null,2));assertBudgets(evaluation);
