<%@ page contentType="text/html; charset=UTF-8" pageEncoding="ISO-8859-1" %><%@page import="org.apache.commons.httpclient.methods.*"%><%@page import="org.apache.commons.httpclient.*"%><%@page session="false"%><%@page import="java.net.*,java.io.*" %><%@page import="java.util.regex.Matcher"%><%@page import="java.util.regex.Pattern"%><%

    String reqUrl = request.getQueryString();
    String decodedReUrl = "";
    GetMethod method = null;
    try {
        decodedReUrl = URLDecoder.decode(reqUrl, "UTF-8");
    } catch (Exception ex) {
    }

    HttpClient client = new HttpClient();
    try {
        method = new GetMethod(decodedReUrl);
    } catch (Exception e) {
        method = new GetMethod(reqUrl);
    }

    try {
        // Execute the method.
        int statusCode = client.executeMethod(method);

        if (statusCode != HttpStatus.SC_OK) {
            out.println("Method failed: " + method.getStatusLine());
        }

        // Read the response body.
        byte[] responseBody = method.getResponseBody();

        // Deal with the response.
        // Use caution: ensure correct character encoding and is not binary data

        Pattern pattern = Pattern.compile("\\<!DOCTYPE.+?\\>");
        Matcher matcher = null;
        StringBuffer sb = new StringBuffer();

        matcher = pattern.matcher(new String(responseBody));
        boolean result = matcher.find();
        while (result) {
            matcher.appendReplacement(sb, "");
            result = matcher.find();
        }
        matcher.appendTail(sb);
        out.print(sb);



    } catch (Exception e) {
        out.print(e.getMessage());
    }

%>