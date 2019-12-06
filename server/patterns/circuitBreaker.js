function CircuitBreaker(max_errors = 3, timeout = 3000){
  this.max_errors = max_errors;
  this.timeout = timeout;
  this.req_list = [];
  this.req_registration = (req) => {
    this.req_list[req] = (this.req_list[req] === undefined) ? { req_status: true, error: 0 } : this.req_list[req];
  };
  this.req_seccess = (req, context) => {
    context.req_registration(req);
    context.req_list[req].error = 0;
    context.req_list[req].req_status = true;
  };
  this.req_error = (req) => {
    this.req_registration(req);
    this.req_list[req].error++;
    if (this.req_list[req].error >= this.max_errors) {
      this.req_list[req].req_status = false;
      setTimeout(this.req_seccess, this.timeout, req, this);
    }
  };
  this.is_ok = (req) => {
    this.req_registration(req)
    return this.req_list[req].req_status;
  }
}

module.exports = CircuitBreaker;
