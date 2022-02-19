'use strict';

module.exports = function report(context, message, messageId, data) {
  context.report(
    Object.assign(
      messageId ? { messageId } : { message },
      data
    )
  );
};
