package org.benetech.servicenet.filters;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.benetech.servicenet.domain.RequestLogger;
import org.benetech.servicenet.service.RequestLoggerService;
import org.benetech.servicenet.service.mapper.RequestLoggerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;
import org.springframework.web.util.WebUtils;

@Component
public class RequestFilter extends OncePerRequestFilter implements Ordered {

    @Autowired
    private RequestLoggerService requestLoggerService;

    @Autowired
    private RequestLoggerMapper requestLoggerMapper;

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE - 8;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(response);
        String characterEncoding = response.getCharacterEncoding();

        filterChain.doFilter(wrappedRequest, wrappedResponse);

        Map<String, Object> trace = getTrace(wrappedRequest);
        Map<String, Object> responseTrace = getResponseTrace(wrappedResponse);

        getBody(wrappedRequest, trace, characterEncoding);
        getResponseBody(wrappedResponse, responseTrace, characterEncoding);

        RequestLogger requestLogger = new RequestLogger();
        requestLogger.setRemoteAddr(Objects.toString(trace.get("remoteAddr"), ""));
        requestLogger.setRequestUri(Objects.toString(trace.get("requestUri"), ""));
        requestLogger.setRequestMethod(Objects.toString(trace.get("requestMethod"), ""));
        requestLogger.setRequestParameters(Objects.toString(trace.get("requestParams"), ""));
        requestLogger.setRequestBody(Objects.toString(trace.get("body"), ""));
        requestLogger.setResponseStatus(Objects.toString(responseTrace.get("status"), ""));
         if (!Objects.toString(responseTrace.get("status"), "").startsWith("2")) {
             requestLogger.setResponseBody(
                 Objects.toString(responseTrace.get("body"), "").replaceAll("\u0000", "")
             );
         }

        requestLoggerService.save(requestLoggerMapper.toDto(requestLogger));

        wrappedResponse.copyBodyToResponse();
    }

    private void getBody(ContentCachingRequestWrapper request, Map<String, Object> trace, String characterEncoding) {
        ContentCachingRequestWrapper wrapper = WebUtils.getNativeRequest(request, ContentCachingRequestWrapper.class);
        if (wrapper != null) {
            byte[] buf = wrapper.getContentAsByteArray();
            if (buf.length > 0) {
                String payload;
                try {
                    payload = new String(buf, 0, buf.length, characterEncoding);
                }
                catch (UnsupportedEncodingException ex) {
                    payload = "[unknown]";
                }

                if (Objects.toString(trace.get("requestUri"), "").contains("authentication")) {
                    trace.put("body", payload.replaceAll("\"password\":\".+?\"", "\"password\":\"fakePassword\""));
                }

                if (Objects.toString(trace.get("requestUri"), "").contains("change-password")) {
                    trace.put("body", payload.replaceAll("\"(newPassword|currentPassword)\":\".+?\"", "\"password\":\"fakePassword\""));
                }
            }
        }
    }

    private void getResponseBody(ContentCachingResponseWrapper response, Map<String, Object> trace, String characterEncoding) {
        ContentCachingResponseWrapper wrapper = WebUtils.getNativeResponse(response, ContentCachingResponseWrapper.class);
        if (wrapper != null) {
            byte[] buf = wrapper.getContentAsByteArray();
            if (buf.length > 0) {
                String payload;
                try {
                    payload = new String(buf, 0, buf.length, characterEncoding);
                }
                catch (Exception ex) {
                    payload = "[unknown]";
                }

                trace.put("body", payload);
            }
        }
    }

    protected Map<String, Object> getTrace(HttpServletRequest request) {
        Map<String, Object> trace = new LinkedHashMap<String, Object>();
        trace.put("requestMethod", request.getMethod());
        trace.put("remoteAddr", request.getRemoteAddr());
        trace.put("requestUri", request.getRequestURI());
        trace.put("requestParams", request.getQueryString());

        return trace;
    }

    protected Map<String, Object> getResponseTrace(HttpServletResponse response) {
        Map<String, Object> trace = new LinkedHashMap<String, Object>();
        trace.put("status", response.getStatus());

        return trace;
    }

}
