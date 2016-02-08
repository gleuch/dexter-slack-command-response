var rest = require('restler');
module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var text = step.input('text').first();
        var resp_url = step.input('response_url').first();

        if (text == undefined || !text.length) {
            return this.fail({'message': 'Invalid message'});
        }
        else if (resp_url == undefined || !resp_url.length) {
            return this.fail({'message': 'Invalid response URL'});
        }

        var self = this;
        var data = {
          text: text,
          response_type: 'in_channel'
        };

        rest.postJson(resp_url, data).on('complete', function(result, response) {
            if (response.statusCode != 200) {
                return self.fail({
                    statusCode: response.statusCode,
                    headers: response.headers,
                    data: result,
                    message: 'Posting failed. Invalid status code: ' + response.statusCode
                });
            }

            self.complete({});
        });
    }
};
