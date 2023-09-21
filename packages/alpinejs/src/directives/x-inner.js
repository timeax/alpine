import { directive, prefix } from "../directives";
import { addRootSelector } from "../lifecycle";


addRootSelector(() => `[${prefix('inner')}]`);

directive('inner', (
    /**
     *@type {HTMLTemplateElement}
     **/
    el, {
        expression
    }, {
        evaluateLater,
        effect,
        cleanup
    }) => {
    let expr = evaluateLater(expression);
    /**
     *@type {HTMLElement}
     */
    let parent = el.parentElement;

    let children = null;
    effect(() => {
        children?.forEach(item => item.isConnected && item.remove());
        expr(value => {
            el.innerHTML = value;
            const content = el.content;
            //---------
            let list = Array.from(content.childNodes);
            //---------
            parent.insertBefore(content, el);
            //------
            children = list
        });
    });

    cleanup(() => {
        children && children.forEach(item => {
            try {
                item.remove();
            } catch (e) { }
        })
    })
})
