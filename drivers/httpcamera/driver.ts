import Homey from 'homey';

class MyDriver extends Homey.Driver {
  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('Camera driver has been initialized');
  }
}

module.exports = MyDriver;
