"use strict";
const speedcontrolUserAddition_1 = require("./speedcontrolUserAddition");
const spreadsheet_1 = require("./spreadsheet");
const speedcontrol_1 = require("./speedcontrol");
const commentator_1 = require("./commentator");
module.exports = (nodecg) => {
    (0, speedcontrolUserAddition_1.speedcontrolUserAddition)(nodecg);
    (0, spreadsheet_1.spreadsheet)(nodecg);
    (0, speedcontrol_1.speedcontrol)(nodecg);
    (0, commentator_1.commentator)(nodecg);
};
