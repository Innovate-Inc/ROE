<!--- 
This is a simple proxy that only supports GET requests and does not do any URL rewriting.
Intended use is to proxy requests made dynamically by ROE (Report on the Environment) website 
web maps to the ArcGIS server REST API.

By Ayhan Ergul - Innovate Inc. - 8/16/2012
<cfoutput>#CGI.QUERY_STRING#</cfoutput>
--->

<!--- Suppress any whitespace to prevent XML content from breaking. --->
<cfprocessingdirective suppresswhitespace="true">
	<!--- Prevent debug output from getting mingled with content from proxy target --->
	<cfsetting showdebugoutput="false" />

	<!--- Extract the URL for proxy target --->
	<cfset proxyTarget = Url.url />

<!---
<cfoutput>#proxyTarget#</cfoutput>
--->
	<cfif 
		FindNoCase("http://Geodata.epa.gov/ArcGIS/", proxyTarget) is 1 or
		FindNoCase("http://www.fishcda.com/ArcGIS/", proxyTarget) is 1 or
		FindNoCase("http://dev.innovateteam.com/ArcGIS/", proxyTarget) is 1 
	>
		<!--- Make the HTTP request to proxy target --->
		<cfhttp url="#proxyTarget#" method="get" useragent="Innovate_Coldfusion_Proxy_v0.1" timeout="5" result="target">
		</cfhttp>
	
		<!--- Return the content received from proxy target after replacing a schema reference that trips up IE --->
		<cfcontent type="#target.mimeType#" />
		<cfoutput>#ReplaceNoCase(target.FileContent, "http://www.w3.org/TR/html4/loose.dtd", "")#</cfoutput>
	<cfelse>
		<cfoutput>Invalid target specified.</cfoutput>
		<cfreturn />
	</cfif>

</cfprocessingdirective>
