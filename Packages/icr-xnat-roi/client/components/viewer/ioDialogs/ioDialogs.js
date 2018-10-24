import { icrXnatRoiSession } from 'meteor/icr:xnat-roi-namespace';

Template.ioDialogs.onRendered(() => {
    const instance = Template.instance();
    const dialogIds = ['exportVolumes', 'importVolumes', 'ioSetName', 'ioMessage'];

    console.log('ioDialogs onRendered');

    dialogIds.forEach(id => {
        const dialog = instance.$('#' + id);
        dialogPolyfill.registerDialog(dialog.get(0));
    });
});


Template.ioDialogs.helpers({
  exportROIsText: () => {
    console.log('in exportROIsText')
    const canWrite = icrXnatRoiSession.get('writePermissions');

    if (canWrite) {
      return "This command will export all new (unlocked) ROIs in this series as an ROI Collection. You will be prompted to give the ROI Collection a name before you may export";
    } else {
      return `This command is disabled as you do not have the required permissions to write to ${icrXnatRoiSession.get("projectId")}/${icrXnatRoiSession.get("experimentLabel")}.`
      + ' If you believe that you should, please contact the project owner.';
    }
  }
});
