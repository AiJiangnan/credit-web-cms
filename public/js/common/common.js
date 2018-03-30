/**
 * 模板引擎
 * @param tpl 模板
 * @param viewId 视图ID
 * @param data 数据
 */
const laytplrender = (tpl, viewId, data) => layui.use('laytpl', () => {
    const [l, g, v] = [layui.laytpl, tpl.innerHTML, document.getElementById(viewId)];
    l(g).render(data, h => v.innerHTML = h);
});

/**
 * 判断是否存在Tab
 * @param id Tab的lay-id
 */
const hasTab = id => layui.jquery("li[lay-id=" + id + "]").length;