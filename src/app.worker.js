export default () => {
    self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
        if (!e) return;
        if (e.data.taskType === 'groupData') {
            let reducedData = [];
            let data = e.data.data;
            let grouped = data.reduce((r, a) => {
                r[a.city] = r[a.city] || [];
                r[a.city].push(a);
                return r;
            }, Object.create(null));
            Object.keys(grouped).forEach(item => {
                let localInstalls = 0;
                let localTrials = 0;
                grouped[item].forEach(e => {
                    localInstalls = localInstalls + e.installs;
                    localTrials = localTrials + e.trials;
                });
                let localConversions = (localTrials / localInstalls) * 100;
                reducedData.push({
                    city: item,
                    installs: localInstalls,
                    trials: localTrials,
                    conversions: Number(localConversions.toFixed(1))
                })
            });
            postMessage(reducedData)
        }
    })
}
