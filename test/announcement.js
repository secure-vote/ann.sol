const Ann = artifacts.require("./Announcement.sol");

const log = (thing) => console.log(thing);

contract('Announcement', function (accounts) {

    it("should instantiate and add auditors", function () {
        const auditors = [accounts[1], accounts[2]];
        const owner = accounts[0];
        let ann;

        log(auditors);

        return Ann.deployed().then(instance => {
            ann = instance;
            return ann.nMsgsWaiting();
        }).then(({ c: [ nMW ]}) => {
            assert.equal(nMW, 0, 'should have no anns yet');
            return ann.auditors(auditors[0]);
        }).then(isAuditor => {
            assert.equal(isAuditor, true, 'auditor[0] is not auditor');
            return ann.auditors(auditors[1])
        }).then(isAuditor => {
            assert.equal(isAuditor, true, 'auditor[1] is not auditor');
            return ann.addAnn('testHash');
        }).then(r => {
            return ann.nMsgsWaiting();
        }).then(({ c: [ nMW ]}) => {
            assert.equal(nMW, 1, 'should have 1 msg waiting');
            return ann.nMsg();
        }).then(({ c: [nM]}) => {
            assert.equal(nM, 0, 'should have no msgs yet')
            return ann.addAudit(0, true, { from: auditors[0] });
        }).then((r) => {
            return ann.nMsg();
        }).then(({c:[nM]}) => {
            assert.equal(nM, 1, 'should have 1 msg');
            return ann.msgMap(0)
        }).then(r => {
            assert.equal(r[0], 'testHash', 'ann string should match')
            log('adding second announcement')
            return ann.addAnn('test2')
        }).then(() => {
            return ann.addAudit(1, false, {from: auditors[1]})
        }).then(() => {
            return ann.nMsg();
        }).then(({c:[nM]}) => {
            assert.equal(nM, 1, 'should only have 1 issue due to triggering alarm')
            return ann.nAlarms();
        }).then(({c:[nA]}) => {
            assert.equal(nA, 1, 'should have 1 alarm');
            return ann.alarms(0);
        }).then(({c:[aN]}) => {
            assert.equal(aN, 1, 'alarm should correspond to index 1');
        })
    })
});
