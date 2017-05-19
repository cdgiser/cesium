/*global define*/
define([
        './defaultValue',
        './defined',
        './defineProperties',
        './RequestState',
        './RequestType'
    ], function(
        defaultValue,
        defined,
        defineProperties,
        RequestState,
        RequestType) {
    'use strict';

    /**
     * Stores information for making a request. This should not be constructed directly. Instead, call the appropriate load function, like `loadWithXhr`, `loadImage`, etc.
     *
     * @alias Request
     * @constructor
     *
     * @param {Object} [options] An object with the following properties:
     * @param {Boolean} [options.throttle=false] Whether to throttle and prioritize the request. If false, the request will be sent immediately. If true, the request will be throttled and sent based on priority.
     * @param {Boolean} [options.throttleByServer=false] Whether to throttle the request by server.
     * @param {RequestType} [options.type=RequestType.OTHER] The type of request.
     * @param {Number} [options.distance=0.0] The distance from the camera, used to prioritize requests.
     * @param {Number} [options.screenSpaceError=0.0] The screen space error, used to prioritize requests.
     */
    function Request(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        var throttleByServer = defaultValue(options.throttleByServer, false);
        var throttle = throttleByServer || defaultValue(options.throttle, false);

        /**
         * Whether to throttle and prioritize the request. If false, the request will be sent immediately. If true, the
         * request will be throttled and sent based on priority.
         *
         * @type {Boolean}
         * @readonly
         *
         * @default false
         */
        this.throttle = throttle;

        /**
         * Whether to throttle the request by server. Browsers typically support about 6-8 parallel connections
         * for HTTP/1 servers, and an unlimited amount of connections for HTTP/2 servers. Setting this value
         * to <code>true</code> is preferable for requests going through HTTP/1 servers.
         *
         * @type {Boolean}
         * @readonly
         *
         * @default false
         */
        this.throttleByServer = throttleByServer;

        /**
         * Type of request.
         *
         * @type {RequestType}
         * @readonly
         *
         * @default RequestType.OTHER
         */
        this.type = defaultValue(options.type, RequestType.OTHER);

        /**
         * The distance from the camera, used to prioritize requests. This value may be edited continually to update
         * the request's priority.
         *
         * @type {Number}
         *
         * @default 0.0
         */
        this.distance = defaultValue(options.distance, 0.0);

        /**
         * The screen space error, used to prioritize requests. This value may be edited continually to update
         * the request's priority.
         *
         * @type {Number}
         *
         * @default 0.0
         */
        this.screenSpaceError = defaultValue(options.screenSpaceError, 0.0);

        /**
         * The URL to request.
         *
         * @private
         */
        this.url = undefined;

        /**
         * The request server, derived from the url.
         *
         * @private
         */
        this.server = undefined;

        /**
         * The actual function that makes the request. The function takes no arguments and returns a promise for the requested data.
         * Set by the following load functions:
         *
         * @private
         */
        this.requestFunction = undefined;

        /**
         * The current state of the request.
         *
         * @private
         */
        this.state = RequestState.UNISSUED;

        /**
         * Reference to the underlying XMLHttpRequest so that it may be aborted in RequestScheduler.
         *
         * @private
         */
        this.xhr = undefined;

        /**
         * The requests's deferred promise.
         *
         * @private
         */
        this.deferred = undefined;
    }

    /**
     * Mark the request as cancelled.
     *
     * @private
     */
    Request.prototype.cancel = function() {
        this.state = RequestState.CANCELLED;
    };

    return Request;
});
