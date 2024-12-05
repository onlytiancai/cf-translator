export default {
  async fetch(request, env) {
    // 添加 CORS 支持
    const handleCors = (request) => {
      const headers = new Headers({
        'Access-Control-Allow-Origin': '*', // 允许所有来源
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // 允许的方法
        'Access-Control-Allow-Headers': 'Content-Type', // 允许的请求头
      });

      return headers;
    };
    const corsHeaders = handleCors(request);
    // 处理预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);
      const text = url.searchParams.get('text');
      const source_lang = url.searchParams.get('source_lang');
      const target_lang = url.searchParams.get('target_lang');

      if (!text || !source_lang || !target_lang) {
        return new Response(
          JSON.stringify({ error: 'Missing required parameters' }),
          { status: 400, headers: corsHeaders }
        );
      }
      const inputs = {text,source_lang,target_lang,};
      const response = await env.AI.run('@cf/meta/m2m100-1.2b', inputs);

      return new Response(
        JSON.stringify({ inputs, response }),
        { headers: corsHeaders }
      );

    } catch (err) {
      return new Response(
        JSON.stringify({ error: 'Internal Server Error' }),
        { status: 500, headers: corsHeaders }
      );
    }
  },
};
