import { directive, prefix } from '../directives'
import { initInterceptors } from '../interceptor'
import { injectDataProviders } from '../datas'
import { addRootSelector } from '../lifecycle'
import { shouldSkipRegisteringDataDuringClone } from '../clone'
import { addScopeToNode } from '../scope'
import { injectMagics, magic } from '../magics'
import { reactive } from '../reactivity'
import { evaluate } from '../evaluator'

addRootSelector(() => `[${prefix('data')}]`);
addRootSelector(() => `[${prefix('fragment')}]`);

directive('data', ((el, { expression }, { cleanup }) => {
    if (shouldSkipRegisteringDataDuringClone(el)) return

    expression = expression === '' ? '{}' : expression

    let magicContext = {}
    injectMagics(magicContext, el)

    let dataProviderContext = {}
    injectDataProviders(dataProviderContext, magicContext)

    let data = evaluate(el, expression, { scope: dataProviderContext })

    if (data === undefined || data === true) data = {}

    injectMagics(data, el)

    let reactiveData = reactive(data)

    initInterceptors(reactiveData)

    let undo = addScopeToNode(el, reactiveData)

    reactiveData['init'] && evaluate(el, reactiveData['init'])

    cleanup(() => {
        reactiveData['destroy'] && evaluate(el, reactiveData['destroy'])

        undo()
    })
}))



directive("fragment", (/**@type {HTMLTemplateElement} */el,  /**@type {{expression: AnalyserNode, modifiers: string[], value: any}}*/{ expression }, { cleanup }) => {
    if (shouldSkipRegisteringDataDuringClone(el)) return;

    expression = expression === "" ? "{}" : expression;

    let magicContext = {};
    injectMagics(magicContext, el);

    let dataProviderContext = {};
    injectDataProviders(dataProviderContext, magicContext);

    let data = evaluate(el, expression, { scope: dataProviderContext });
    if (data === undefined || data === true) data = {};
    //--------
    const elements = Array.from(el.content.children);
    //------
    injectMagics(data, el.content);

    let reactiveData = reactive(data);
    initInterceptors(reactiveData);

    const undos = []
    elements.forEach(item => {
        //-----------
        undos.push(addScopeToNode(item, reactiveData));
        reactiveData["init"] && evaluate(item, reactiveData["init"]);
    });

    el.parentElement.insertBefore(el.content, el);
    // el.remove()
    cleanup(() => {
        //---------
        reactiveData["destroy"] && evaluate(el, reactiveData["destroy"]);
        // //-------
        undos.forEach(item => item());
    });
});


