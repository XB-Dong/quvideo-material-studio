import assert from 'node:assert/strict';
export const FROZEN_P0_JS_GZIP_BYTES=156375;
export function evaluateBudgets(report,baseline=FROZEN_P0_JS_GZIP_BYTES){
 assert(Number.isFinite(baseline)&&baseline>=0,'BASELINE_JS_GZIP_BYTES must be a nonnegative number');
 const limits={baselineJsGzipBytes:baseline,maxAdditionalJsGzipBytes:35*1024,maxImageEncodedBytes:800*1024,maxCls:0.1,maxPageErrors:0};
 const checks=[];
 for(const run of report.runs){for(const [metric,actual,limit] of [['imageEncodedBytes',run.imageEncodedBytes,limits.maxImageEncodedBytes],['cls',run.metrics.cls,limits.maxCls],['pageErrors',run.errors?.length,0],['additionalJsGzipBytes',run.scriptNormalizedGzipBytes-baseline,limits.maxAdditionalJsGzipBytes]])checks.push({run:run.run,metric,actual,limit,pass:Number.isFinite(actual)&&actual<=limit});}
 return {limits,rule:'Every individual observed run must pass; image requests remain counted as actually transferred, without URL deduplication or median substitution',checks,pass:checks.length>0&&checks.every(c=>c.pass)};
}
export function assertBudgets(evaluation){assert(evaluation.pass,'Measured budgets failed: '+JSON.stringify(evaluation.checks.filter(c=>!c.pass)));}
