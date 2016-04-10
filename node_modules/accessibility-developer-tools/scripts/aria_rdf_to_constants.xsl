<?xml version="1.0" encoding="UTF-8"?>
<!--
// Copyright 2014 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
-->
<!--
    This can be used to generate 'axs.constants.ARIA_ROLES' when run against the ARIA taxonomy RDF at
        http://www.w3.org/WAI/ARIA/schemata/aria-1.rdf.

    Note that the hard-coded version has properties not found in the taxonomy:
        - childpresentational
        - namerequired
        - abstract
    If necessary these can be added to the generated object in JS or hard coded in this XSLT.

    NOTE: At time of writing this is not hooked up to any part of the automated build - it is currently a standalone utility.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
                xmlns:role="http://www.w3.org/1999/xhtml/vocab#"
                xmlns:states="http://www.w3.org/2005/07/aaa#"
                xmlns:xsd="http://www.w3.org/2001/XMLSchema#"
                xmlns:dc="http://purl.org/dc/elements/1.1/#"
                xmlns:owl="http://www.w3.org/2002/07/owl#"
                xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                version="1.0">

    <xsl:output method="text"/>
    <xsl:param name="indent" select="'    '"/>
    <xsl:param name="newline" select="'&#xa;'"/>

    <xsl:template match="/rdf:RDF">
        <xsl:text>/** @type {Object.&lt;string, Object&gt;} */</xsl:text>
        <xsl:value-of select="concat($newline, 'axs.constants.ARIA_ROLES = {', $newline)"/>
        <xsl:apply-templates select="owl:Class"/>
        <xsl:value-of select="concat($newline, '}')"/>
    </xsl:template>

    <xsl:template match="owl:Class">
        <xsl:value-of select="concat($indent, '&quot;', @rdf:ID, '&quot;: {')"/>
        <xsl:call-template name="toJsonArray">
            <xsl:with-param name="prop">namefrom</xsl:with-param>
            <xsl:with-param name="nodes" select="role:nameFrom"/>
            <xsl:with-param name="leadingComma">0</xsl:with-param>
        </xsl:call-template>
        <xsl:if test="rdfs:subClassOf">
            <xsl:call-template name="toJsonArray">
                <xsl:with-param name="prop">parent</xsl:with-param>
                <xsl:with-param name="nodes" select="rdfs:subClassOf"/>
            </xsl:call-template>
        </xsl:if>
        <xsl:if test="role:requiredState|role:supportedState">
            <xsl:if test="role:requiredState">
                <xsl:call-template name="toJsonArray">
                    <xsl:with-param name="prop">requiredProperties</xsl:with-param>
                    <xsl:with-param name="nodes" select="role:requiredState"/>
                </xsl:call-template>
            </xsl:if>
            <xsl:call-template name="toJsonArray">
                <xsl:with-param name="prop">properties</xsl:with-param>
                <xsl:with-param name="nodes" select="role:requiredState|role:supportedState"/>
            </xsl:call-template>
        </xsl:if>
        <xsl:if test="role:mustContain">
            <xsl:call-template name="toJsonArray">
                <xsl:with-param name="prop">mustcontain</xsl:with-param>
                <xsl:with-param name="nodes" select="role:mustContain"/>
            </xsl:call-template>
        </xsl:if>
        <xsl:if test="role:scope">
            <xsl:call-template name="toJsonArray">
                <xsl:with-param name="prop">scope</xsl:with-param>
                <xsl:with-param name="nodes" select="role:scope"/>
            </xsl:call-template>
        </xsl:if>
        <xsl:value-of select="concat($newline, $indent, '}')"/>
        <xsl:if test="position() != last()">
            <xsl:text>,</xsl:text>
            <xsl:value-of select="$newline"/>
        </xsl:if>
    </xsl:template>

    <xsl:template match="rdfs:subClassOf|role:requiredState|role:supportedState|role:mustContain|role:scope">
        <xsl:param name="total">1</xsl:param>
        <xsl:if test="$total &gt; 3">
            <xsl:value-of select="concat($newline, $indent, $indent, $indent, $indent)"/>
        </xsl:if>
        <xsl:text>"</xsl:text>
        <xsl:value-of select="substring-after (@rdf:resource, '#')"/>
        <xsl:text>"</xsl:text>
        <xsl:if test="position() != last()">
            <xsl:text>, </xsl:text>
        </xsl:if>
    </xsl:template>

    <xsl:template match="role:nameFrom">
        <xsl:text>"</xsl:text>
        <xsl:value-of select="."/>
        <xsl:text>"</xsl:text>
        <xsl:if test="position() != last()">
            <xsl:text>, </xsl:text>
        </xsl:if>
    </xsl:template>

    <xsl:template name="toJsonArray">
        <xsl:param name="prop"/>
        <xsl:param name="nodes"/>
        <xsl:param name="leadingComma">1</xsl:param>
        <xsl:variable name="prefix">
            <xsl:choose>
                <xsl:when test="$leadingComma=0">
                    <xsl:value-of select="concat($newline, $indent, $indent)"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="concat(',', $newline, $indent, $indent)"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:value-of select="$prefix"/>
        <xsl:text>"</xsl:text>
        <xsl:value-of select="$prop"/>
        <xsl:text>": [ </xsl:text>
        <xsl:apply-templates select="$nodes">
            <xsl:with-param name="total">
                <xsl:value-of select="count($nodes)"/>
            </xsl:with-param>
        </xsl:apply-templates>
        <xsl:text> ]</xsl:text>
    </xsl:template>

    <xsl:template match="rdfs:comment|text()"/>
</xsl:stylesheet>
