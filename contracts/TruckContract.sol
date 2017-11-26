pragma solidity ^0.4.17;


contract TruckContract {
    struct INCIDENT_DATA {
        int temperature;
        int delay;
        int pressure;
        int light;
        int breakageAlert;
    }

    address creator;
    string truckContractName;
    INCIDENT_DATA incidentData;

    function TruckContract(string _truckContractName) public {
        creator = msg.sender;
        truckContractName = _truckContractName;
        incidentData = INCIDENT_DATA({temperature: 0, delay: 0, pressure: 0, light: 0, breakageAlert: 0});
    }

    function getContractName() public constant returns (string) {
        return truckContractName;
    }

    function getContractAddress() public constant returns (address) {
        return this;
    }

    function getTemperature() public constant returns (int) {
        return incidentData.temperature;
    }

    function setTemperature(int _temperature) private {
        incidentData.temperature = _temperature;
    }

    function getDelay() public constant returns (int) {
        return incidentData.delay;
    }

    function setDelay(int _delay) private {
        incidentData.delay = _delay;
    }

    function getPressure() public constant returns (int) {
        return incidentData.pressure;
    }

    function setPressure(int _pressure) private {
        incidentData.pressure = _pressure;
    }

    function getLight() public constant returns (int) {
        return incidentData.light;
    }

    function setLight(int _light) private {
        incidentData.light = _light;
    }

    function getBreakageAlert() public constant returns (int) {
        return incidentData.breakageAlert;
    }

    function setBreakageAlert(int _breakageAlert) private {
        incidentData.breakageAlert = _breakageAlert;
    }

    function getIncidentData() public constant returns (int, int, int, int, int) {
        return (incidentData.temperature, incidentData.delay, incidentData.pressure, incidentData.light, incidentData.breakageAlert);
    }

    function setIncidentData(int _temperature, int _delay, int _pressure, int _light, int _breakageAlert) public {
        incidentData.temperature = _temperature;
        incidentData.delay = _delay;
        incidentData.pressure = _pressure;
        incidentData.light = _light;
        incidentData.breakageAlert = _breakageAlert;
    }

    function kill() public {
        if (msg.sender == creator)
        selfdestruct(creator);
    }
}