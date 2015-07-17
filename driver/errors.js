// Generated by CoffeeScript 1.9.3
(function() {
  var RqlClientError, RqlCompileError, RqlDriverError, RqlQueryPrinter, RqlRuntimeError, RqlServerError,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  RqlDriverError = (function(superClass) {
    extend(RqlDriverError, superClass);

    function RqlDriverError(msg) {
      this.name = this.constructor.name;
      this.msg = msg;
      this.message = msg;
      if (Error.captureStackTrace != null) {
        Error.captureStackTrace(this, this);
      }
    }

    return RqlDriverError;

  })(Error);

  RqlServerError = (function(superClass) {
    extend(RqlServerError, superClass);

    function RqlServerError(msg, term, frames) {
      this.name = this.constructor.name;
      this.msg = msg;
      this.frames = frames.slice(0);
      if (term != null) {
        if (msg[msg.length - 1] === '.') {
          this.message = (msg.slice(0, msg.length - 1)) + " in:\n" + (RqlQueryPrinter.prototype.printQuery(term)) + "\n" + (RqlQueryPrinter.prototype.printCarrots(term, frames));
        } else {
          this.message = msg + " in:\n" + (RqlQueryPrinter.prototype.printQuery(term)) + "\n" + (RqlQueryPrinter.prototype.printCarrots(term, frames));
        }
      } else {
        this.message = "" + msg;
      }
      if (Error.captureStackTrace != null) {
        Error.captureStackTrace(this, this);
      }
    }

    return RqlServerError;

  })(Error);

  RqlRuntimeError = (function(superClass) {
    extend(RqlRuntimeError, superClass);

    function RqlRuntimeError() {
      return RqlRuntimeError.__super__.constructor.apply(this, arguments);
    }

    return RqlRuntimeError;

  })(RqlServerError);

  RqlCompileError = (function(superClass) {
    extend(RqlCompileError, superClass);

    function RqlCompileError() {
      return RqlCompileError.__super__.constructor.apply(this, arguments);
    }

    return RqlCompileError;

  })(RqlServerError);

  RqlClientError = (function(superClass) {
    extend(RqlClientError, superClass);

    function RqlClientError() {
      return RqlClientError.__super__.constructor.apply(this, arguments);
    }

    return RqlClientError;

  })(RqlServerError);

  RqlQueryPrinter = (function() {
    var carrotMarker, carrotify, composeCarrots, composeTerm, joinTree;

    function RqlQueryPrinter() {}

    RqlQueryPrinter.prototype.printQuery = function(term) {
      var tree;
      tree = composeTerm(term);
      return joinTree(tree);
    };

    composeTerm = function(term) {
      var arg, args, key, optargs, ref;
      args = (function() {
        var j, len, ref, results;
        ref = term.args;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          arg = ref[j];
          results.push(composeTerm(arg));
        }
        return results;
      })();
      optargs = {};
      ref = term.optargs;
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        arg = ref[key];
        optargs[key] = composeTerm(arg);
      }
      return term.compose(args, optargs);
    };

    RqlQueryPrinter.prototype.printCarrots = function(term, frames) {
      var tree;
      if (frames.length === 0) {
        tree = [carrotify(composeTerm(term))];
      } else {
        tree = composeCarrots(term, frames);
      }
      return (joinTree(tree)).replace(/[^\^]/g, ' ');
    };

    composeCarrots = function(term, frames) {
      var arg, args, frame, i, key, optargs, ref;
      frame = frames.shift();
      args = (function() {
        var j, len, ref, results;
        ref = term.args;
        results = [];
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          arg = ref[i];
          if (frame === i) {
            results.push(composeCarrots(arg, frames));
          } else {
            results.push(composeTerm(arg));
          }
        }
        return results;
      })();
      optargs = {};
      ref = term.optargs;
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        arg = ref[key];
        if (frame === key) {
          optargs[key] = composeCarrots(arg, frames);
        } else {
          optargs[key] = composeTerm(arg);
        }
      }
      if (frame != null) {
        return term.compose(args, optargs);
      } else {
        return carrotify(term.compose(args, optargs));
      }
    };

    carrotMarker = {};

    carrotify = function(tree) {
      return [carrotMarker, tree];
    };

    joinTree = function(tree) {
      var j, len, str, term;
      str = '';
      for (j = 0, len = tree.length; j < len; j++) {
        term = tree[j];
        if (Array.isArray(term)) {
          if (term.length === 2 && term[0] === carrotMarker) {
            str += (joinTree(term[1])).replace(/./g, '^');
          } else {
            str += joinTree(term);
          }
        } else {
          str += term;
        }
      }
      return str;
    };

    return RqlQueryPrinter;

  })();

  module.exports.RqlDriverError = RqlDriverError;

  module.exports.RqlRuntimeError = RqlRuntimeError;

  module.exports.RqlCompileError = RqlCompileError;

  module.exports.RqlClientError = RqlClientError;

  module.exports.printQuery = RqlQueryPrinter.prototype.printQuery;

}).call(this);
