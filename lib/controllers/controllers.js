
const axios = require('axios');
const API_URL = process.env.API_URL;

const appendSocketToLicense = (pi_data) => {
    axios.post(`${API_URL}/license/UpdateSocketIds`, pi_data)
    .then((res) => {
        console.log('License Socket Updated: ', pi_data);
    }).catch((error) => {
        console.log('Error Updating Socket of License: ', error);
    });
}

const getLicenseSocketID = license_id => {
    return axios.get(`${API_URL}/license/GetSocketByLicense?licenseId=${license_id}`)
    .then((res) => {
        return res.data;
    }).catch((error) => {
        console.log('Error getting Socket License ID:', error.response.status);
    });
}

const getSocketLicenseId = socket_id => {
    return axios.get(`${API_URL}/License/GetByPiSocketId?socketid=${socket_id}`)
    .then(function (response) {
        return response.data
    }).catch(function (error) {
        console.log('Error', socket_id);
    });
}

const offlineNotification = (data) => {
    axios.post(`${API_URL}/notification/send`, data)
    .then(function (response) {
        console.log('Disconnected signal sent successfully', data);
    }).catch(function (error) {
        console.log('Error', data);
    });
}

const updateLicensePiandPlayerStatus = (data) => {
    axios.post(`${API_URL}/license/UpdatePiPlayerStatus`, data)
    .then(res => {
        console.log('Status successfully updated', res.status);
    }).catch(err => {
        console.log('Error Updating Player and Pi Status', err)
    })
}

const updateConvertedVideo = (data) => {
    axios.post(`${API_URL}/Content/UpdateContentsIsConverted?uuid=${data}`)
    .then(res => {
        console.log('Content is_converted updated', res.status, data);
    }).catch(err => {
        console.log('Error Updating converted status', err)
    })
}

module.exports = {
    appendSocketToLicense: appendSocketToLicense,
    getLicenseSocketID: getLicenseSocketID,
    getSocketLicenseId: getSocketLicenseId,
    offlineNotification: offlineNotification,
    updateLicensePiandPlayerStatus: updateLicensePiandPlayerStatus,
    updateConvertedVideo: updateConvertedVideo
}