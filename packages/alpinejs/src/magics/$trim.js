import { magic } from '../magics'

magic('watchStates', () => {
    /**
     * @param {any[]} deps
     * @param {Function} event
     */
    return function (deps, event) {
        event.call(this);
        deps.forEach(item => this.$watch(item, (i) => event.call(this, item, i)));
    }
});