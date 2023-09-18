import { directive, prefix } from "../directives";
import { initInterceptors } from "../interceptor";
import { injectDataProviders } from "../datas";
import { addRootSelector } from "../lifecycle";
import { shouldSkipRegisteringDataDuringClone } from "../clone";
import { addScopeToNode } from "../scope";
import { injectMagics, magic } from "../magics";
import { reactive } from "../reactivity";
import { evaluate } from "../evaluator";

addRootSelector(() => `[${prefix("data")}]`);

/**
 * @type {{
 *  [x: string]: {
 *  data: any,
 * elements: HTMLElement[]
 * }
 * }}
 */
const states = {};

function stateUtil(id, data, element, reactive) {
    if (!states[id]) {
        states[id] = {
            data: reactive(data),
            elements: []
        };
    }
    states[id].elements.push(element);
    return states[id].data;
}

directive("data", (el, { expression, value: id }, { cleanup }) => {
    if (shouldSkipRegisteringDataDuringClone(el)) return;

    expression = expression === "" ? "{}" : expression;

    let magicContext = {};
    injectMagics(magicContext, el);

    let dataProviderContext = {};
    injectDataProviders(dataProviderContext, magicContext);

    let data = evaluate(el, expression, { scope: dataProviderContext });

    if (data === undefined || data === true) data = {};

    injectMagics(data, el);
    //-----------
    let reactiveData = id
        ? stateUtil(id, data, el, reactive)
        : reactive(data);

    initInterceptors(reactiveData);

    let undo = addScopeToNode(el, reactiveData);

    reactiveData["init"] && evaluate(el, reactiveData["init"]);

    cleanup(() => {
        reactiveData["destroy"] && evaluate(el, reactiveData["destroy"]);
        if (id) {
            const state = states[id];
            state.elements = state.elements.filter(item => item !== el);
            //----
            if (state.elements.length === 0) delete states[id];
        }
        undo();
    });
});
