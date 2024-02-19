import request from '@/utils/request';

export default {
  exeCodeInSandbox: data => request.post('/sandbox/execute-code', data),
}