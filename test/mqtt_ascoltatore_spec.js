describeAscoltatore("MQTT", function() {

  afterEach(function(done) {
    this.instance.close(function() {
      done();
    });
    delete this.instance;
  });

  it("should sync two instances", function(done) {
    var other = new ascoltatori.MQTTAscoltatore(MQTTSettings());
    var that = this;
    async.series([

      function(cb) {
        other.on("ready", cb);
      },

      function(cb) {
        that.instance.subscribe("hello", wrap(done), cb);
      },

      function(cb) {
        other.publish("hello", null, cb);
      },

      function(cb) {
        other.close(cb);
      }
    ]);
  });
  
  it("should publish with options", function(done) {
    var that = this;
    that.instance.subscribe("hello/*", function(topic, value, options) {
      expect(value).to.equal("42");
      expect(options.qos).to.equal(0);
      done();
    }, function () {
      that.instance.publish("hello/123", "42", { qos: 0 });
    });
  });
});
