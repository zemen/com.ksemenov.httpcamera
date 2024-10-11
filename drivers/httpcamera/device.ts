import Homey from 'homey';
import DigestClient from 'digest-fetch';

class MyDevice extends Homey.Device {
  image: Homey.Image | null = null;

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.log('Camera has been initialized');
    this.resetCameraImage();
  }

  async resetCameraImage() {
    if (!this.image) {
      this.image = await this.homey.images.createImage();
    }
    const url = this.getSetting('url');
    if (url) {
      this.image.setStream(async (stream: Homey.Image.ImageStreamMetadata) => {
        try {
          const username = this.getSetting('username');
          const password = this.getSetting('password');
          this.log('Fetching image from:', url)
          const client = new DigestClient(username, password);
          await client.fetch(url).then(async (response: any) => {
            if (!response.ok) {
              throw new Error('Failed to fetch image: ' + response.statusText);
            }
            response.body.pipe(stream);
          });
        } catch (error) {
          throw new Error('Failed to fetch image: ' + error);
        }
      });
      await this.setCameraImage(url, url, this.image);
    }
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('Camera has been added');
    this.resetCameraImage();
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({
    oldSettings,
    newSettings,
    changedKeys,
  }: {
    oldSettings: {[key: string]: boolean | string | number | undefined | null};
    newSettings: {[key: string]: boolean | string | number | undefined | null};
    changedKeys: string[];
  }): Promise<string | void> {
    this.log("Camera settings where changed");
    this.resetCameraImage();
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name: string) {
    this.log('Camera was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.image?.unregister();
    this.log('Camera has been deleted');
  }

}

module.exports = MyDevice;
