/*
 * File:	ShowVer.cpp
 * Version:	1.0,  2002-6-4
 * Purpose:	console program to display file VERSIONINFO text

 * Copyright (c) 2002 by Ted Peck <tpeck@roundwave.com>
 * Permission is given by the author to freely redistribute and include
 * this code in any program as long as this credit is given where due.
 *
 * THIS CODE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTY
 * OF ANY KIND, EITHER EXPRESSED OR IMPLIED. IN PARTICULAR, NO WARRANTY IS MADE
 * THAT THE CODE IS FREE OF DEFECTS, MERCHANTABLE, FIT FOR A PARTICULAR PURPOSE
 * OR NON-INFRINGING. IN NO EVENT WILL THE AUTHOR BE LIABLE FOR ANY COSTS OR DAMAGES 
 * ARISING FROM ANY USE OF THIS CODE. NO USE OF THIS CODE IS AUTHORIZED EXCEPT UNDER
 * THIS DISCLAIMER.
 *
 * Use at your own risk!
 */
// ----------------------------------------------------------------------------

#include <stdio.h>
#include <malloc.h>

#define WIN32_LEAN_AND_MEAN		// Exclude rarely-used stuff from Windows headers
#include <windows.h>

typedef unsigned char byte;

#ifndef _DEBUG
#   define ASSERT(s)
#else
#   include <CRTDbg.h>	// for _ASSERTE()
#   define ASSERT _ASSERTE
#endif

#define	HDUMP	0
// ----------------------------------------------------------------------------
#if HDUMP

#define CHARPRINT(a)	\
	{ unsigned char tchar;			\
	switch (a) {			\
	 case 0x0D:	/* CR */	\
		tchar = 0x11;		\
		break;				\
	 case 0x0A:	/* LF */	\
		tchar = 0x19;		\
		break;				\
	 case 0x07:	/* BEL */	\
		tchar = 0x0F;		\
		break;				\
	 case '\t':	/* TAB */	\
		tchar = 0x1D;		\
		break;				\
	 case '\0':	/* NUL */	\
		tchar = 0xF8;		\
		break;				\
	 case 0x08:	/* BACKTAB? */	\
		tchar = 0xAE;		\
		break;				\
	 case 0x1A:	/* BACKTAB? */	\
		tchar = 0xAE;		\
		break;				\
	 case 0x1B:	/* BACKSPACE */	\
		tchar = 0xAE;		\
		break;				\
	 case ' ':	/* SPACE */	\
		tchar = 0xC4;		\
		break;				\
	 default:				\
		tchar = buf[i];		\
		break;				\
	}						\
	printf ("%c", tchar);	\
	}
// ----------------------------------------------------------------------------

int hdump(byte* pBuf, size_t size, size_t start, size_t len)
{
	int ch;
	int i, firsti, lasti, tlasti;
	unsigned char buf[16];
	unsigned long offs, end;
	firsti = (int)(start & 0xFL);
	offs = start & ~0xFL;

	byte* pEnd = pBuf+size;

	if (pBuf == NULL) {
		return 0;
	}

	end = (len!=0) ? start+len : ~len;
	lasti = 16;
	tlasti = 8;

	for ( ; offs < end; offs += 16) {
		unsigned long rmdr = end - offs;
		if (rmdr < 16) {
			lasti = rmdr;
			if (rmdr < 8) {
				tlasti = rmdr;
			}
		}
		for (i = firsti; i < lasti; i++) {
			ch = (pBuf < pEnd) ? *(pBuf++) : EOF;
			buf[i] = (unsigned char) ch;
			if (ch == EOF) {
				lasti = i;
				if (i < 8) tlasti = i;
				break;
			}
		}
		/* Print address */
		printf("% 8lx:  ", offs);

		/* Print 2 groups of 8 chars in hex format */
		for (i = 0; i < firsti && i < 8; i++) {
			printf("   ");		// only could happen first time around
		}
		for ( ; i < tlasti; i++) {
			printf("%2.2x ", buf[i]);
		}
		for ( ; i < 8; i++) {
			printf("   ");
		}
		printf(" ");
		for ( ; i < firsti; i++) {
			printf("   ");		// only could happen first time around
		}
		for ( ; i < lasti; i++) {
			printf("%2.2x ", (unsigned) buf[i]);
		}
		for ( ; i < 16; i++) {
			printf("   ");
		}
		printf("| ");

		/* Print 2 groups of 8 chars in char format */
		for (i = 0; i < firsti && i < 8; i++) {
			printf("  ");
		}
		for ( ; i < tlasti; i++) {
			CHARPRINT(buf[i])
		}
		for ( ; i < 8; i++) {
			printf("  ");
		}
		printf(" ");

		for ( ; i < firsti; i++) {
			printf("  ");
		}
		for ( ; i < lasti; i++) {
			CHARPRINT(buf[i])
		}
		for ( ; i < 16; i++) {
			printf("  ");
		}

		printf("\n");

		if (ch == EOF) break;

		firsti = 0;
	}
	return 1;
}
#endif // HDUMP
// ----------------------------------------------------------------------------
int usage()
{
	printf("ShowVer <filename>\n");
	return 0;
}
// ----------------------------------------------------------------------------

int error(wchar_t* sfnName)
{
	DWORD dwErrCode = GetLastError();
	wchar_t* sMsg;
	FormatMessageW(FORMAT_MESSAGE_ALLOCATE_BUFFER | FORMAT_MESSAGE_FROM_SYSTEM | FORMAT_MESSAGE_IGNORE_INSERTS,
					NULL,
					dwErrCode,
					MAKELANGID(LANG_NEUTRAL, SUBLANG_DEFAULT), // Default language
					(wchar_t*) &sMsg,
					0,
					NULL);
	// Process any inserts in sMsg.
	// ...
	printf("Unable to access file \"%S\" : %S", sfnName, sMsg);
	LocalFree(sMsg);
	return 0;
}
// ----------------------------------------------------------------------------

/* ----- VS_VERSION.dwFileFlags ----- */
#define S_VS_FFI_SIGNATURE        "VS_FFI_SIGNATURE"
#define S_VS_FFI_STRUCVERSION     "VS_FFI_STRUCVERSION"
#define S_VS_FFI_FILEFLAGSMASK    "VS_FFI_FILEFLAGSMASK"

/* ----- VS_VERSION.dwFileFlags ----- */
#define S_VS_FF_DEBUG             "VS_FF_DEBUG"
#define S_VS_FF_PRERELEASE        "VS_FF_PRERELEASE"
#define S_VS_FF_PATCHED           "VS_FF_PATCHED"
#define S_VS_FF_PRIVATEBUILD      "VS_FF_PRIVATEBUILD"
#define S_VS_FF_INFOINFERRED      "VS_FF_INFOINFERRED"
#define S_VS_FF_SPECIALBUILD      "VS_FF_SPECIALBUILD"

// ----------------------------------------------------------------------------
char* showFileFlags(DWORD dwFileFlags)
{
#define MAXFLAGSSTR	200
	static char s[MAXFLAGSSTR];
	int pos = 0;
	s[pos] = '\0';
#define VS_FF_KNOWNFLAGS (VS_FF_DEBUG \
						| VS_FF_PRERELEASE  \
						| VS_FF_PATCHED  \
						| VS_FF_PRIVATEBUILD  \
						| VS_FF_INFOINFERRED  \
						| VS_FF_SPECIALBUILD  \
						)
	if (dwFileFlags & ~VS_FF_KNOWNFLAGS) pos += sprintf(&s[pos], "0x%x", dwFileFlags & ~VS_FF_KNOWNFLAGS);

	if (dwFileFlags & VS_FF_DEBUG)        { if (pos) { memcpy(&s[pos], " | ", 3); pos += 3; } ; memcpy(&s[pos], S_VS_FF_DEBUG, sizeof(S_VS_FF_DEBUG)); pos += sizeof(S_VS_FF_DEBUG) - 1; }
	if (dwFileFlags & VS_FF_PRERELEASE)   { if (pos) { memcpy(&s[pos], " | ", 3); pos += 3; } ; memcpy(&s[pos], S_VS_FF_PRERELEASE, sizeof(S_VS_FF_PRERELEASE)); pos += sizeof(S_VS_FF_PRERELEASE) - 1; }
	if (dwFileFlags & VS_FF_PATCHED)      { if (pos) { memcpy(&s[pos], " | ", 3); pos += 3; } ; memcpy(&s[pos], S_VS_FF_PATCHED, sizeof(S_VS_FF_PATCHED)); pos += sizeof(S_VS_FF_PATCHED) - 1; }
	if (dwFileFlags & VS_FF_PRIVATEBUILD) { if (pos) { memcpy(&s[pos], " | ", 3); pos += 3; } ; memcpy(&s[pos], S_VS_FF_PRIVATEBUILD, sizeof(S_VS_FF_PRIVATEBUILD)); pos += sizeof(S_VS_FF_PRIVATEBUILD) - 1; }
	if (dwFileFlags & VS_FF_INFOINFERRED) { if (pos) { memcpy(&s[pos], " | ", 3); pos += 3; } ; memcpy(&s[pos], S_VS_FF_INFOINFERRED, sizeof(S_VS_FF_INFOINFERRED)); pos += sizeof(S_VS_FF_INFOINFERRED) - 1; }
	if (dwFileFlags & VS_FF_SPECIALBUILD) { if (pos) { memcpy(&s[pos], " | ", 3); pos += 3; } ; memcpy(&s[pos], S_VS_FF_SPECIALBUILD, sizeof(S_VS_FF_SPECIALBUILD)); pos += sizeof(S_VS_FF_SPECIALBUILD) - 1; }

	if (!pos) memcpy(s, "0", 2);
	return s;
}
/* ----- VS_VERSION.dwFileOS ----- */
#define S_VOS_UNKNOWN             "VOS_UNKNOWN"
#define S_VOS_DOS                 "VOS_DOS"
#define S_VOS_OS216               "VOS_OS216"
#define S_VOS_OS232               "VOS_OS232"
#define S_VOS_NT                  "VOS_NT"

#define S_VOS__BASE               "VOS__BASE"
#define S_VOS__WINDOWS16          "VOS__WINDOWS16"
#define S_VOS__PM16               "VOS__PM16"
#define S_VOS__PM32               "VOS__PM32"
#define S_VOS__WINDOWS32          "VOS__WINDOWS32"

#define S_VOS_DOS_WINDOWS16       "VOS_DOS_WINDOWS16"
#define S_VOS_DOS_WINDOWS32       "VOS_DOS_WINDOWS32"
#define S_VOS_OS216_PM16          "VOS_OS216_PM16"
#define S_VOS_OS232_PM32          "VOS_OS232_PM32"
#define S_VOS_NT_WINDOWS32        "VOS_NT_WINDOWS32"

char* showFileOS(DWORD dwFileOS)
{
	switch(dwFileOS) {
	case VOS_UNKNOWN:	return S_VOS_UNKNOWN;
	case VOS_DOS:		return S_VOS_DOS;
	case VOS_OS216:		return S_VOS_OS216;
	case VOS_OS232:		return S_VOS_OS232;
	case VOS_NT:		return S_VOS_NT;

//	case VOS__BASE:		return S_VOS__BASE;
	case VOS__WINDOWS16:return S_VOS__WINDOWS16;
	case VOS__PM16:		return S_VOS__PM16;
	case VOS__PM32:		return S_VOS__PM32;
	case VOS__WINDOWS32:return S_VOS__WINDOWS32;

	case VOS_DOS_WINDOWS16:	return S_VOS_DOS_WINDOWS16;
	case VOS_DOS_WINDOWS32:	return S_VOS_DOS_WINDOWS32;
	case VOS_OS216_PM16:	return S_VOS_OS216_PM16;
	case VOS_OS232_PM32:	return S_VOS_OS232_PM32;
	case VOS_NT_WINDOWS32:	return S_VOS_NT_WINDOWS32;

	default: return "Unknown FileOS";
	}
}
/* ----- VS_VERSION.dwFileType ----- */
#define S_VFT_UNKNOWN             "VFT_UNKNOWN"
#define S_VFT_APP                 "VFT_APP"
#define S_VFT_DLL                 "VFT_DLL"
#define S_VFT_DRV                 "VFT_DRV"
#define S_VFT_FONT                "VFT_FONT"
#define S_VFT_VXD                 "VFT_VXD"
#define S_VFT_STATIC_LIB          "VFT_STATIC_LIB"

char* showFileType(DWORD dwFileType)
{
	switch(dwFileType) {
	case VFT_UNKNOWN:	return S_VFT_UNKNOWN;
	case VFT_APP:		return S_VFT_APP;
	case VFT_DLL:		return S_VFT_DLL;
	case VFT_DRV:		return S_VFT_DRV;
	case VFT_FONT:		return S_VFT_FONT;
	case VFT_VXD:		return S_VFT_VXD;
	case VFT_STATIC_LIB:return S_VFT_STATIC_LIB;
	default: return "Unknown FileType";
	}
}
/* ----- VS_VERSION.dwFileSubtype for VFT_WINDOWS_DRV ----- */
#define S_VFT2_UNKNOWN            "VFT2_UNKNOWN"
#define S_VFT2_DRV_PRINTER        "VFT2_DRV_PRINTER"
#define S_VFT2_DRV_KEYBOARD       "VFT2_DRV_KEYBOARD"
#define S_VFT2_DRV_LANGUAGE       "VFT2_DRV_LANGUAGE"
#define S_VFT2_DRV_DISPLAY        "VFT2_DRV_DISPLAY"
#define S_VFT2_DRV_MOUSE          "VFT2_DRV_MOUSE"
#define S_VFT2_DRV_NETWORK        "VFT2_DRV_NETWORK"
#define S_VFT2_DRV_SYSTEM         "VFT2_DRV_SYSTEM"
#define S_VFT2_DRV_INSTALLABLE    "VFT2_DRV_INSTALLABLE"
#define S_VFT2_DRV_SOUND          "VFT2_DRV_SOUND"
#define S_VFT2_DRV_COMM           "VFT2_DRV_COMM"
#define S_VFT2_DRV_INPUTMETHOD    "VFT2_DRV_INPUTMETHOD"

/* ----- VS_VERSION.dwFileSubtype for VFT_WINDOWS_FONT ----- */
#define S_VFT2_FONT_RASTER        "VFT2_FONT_RASTER"
#define S_VFT2_FONT_VECTOR        "VFT2_FONT_VECTOR"
#define S_VFT2_FONT_TRUETYPE      "VFT2_FONT_TRUETYPE"

char* showFileSubtype(DWORD dwFileType, DWORD dwFileSubtype)
{
	static char s[50];
	switch(dwFileType) {
	case VFT_DRV:
		switch(dwFileSubtype) {
		case VFT2_UNKNOWN:		return "FileSubtype: " S_VFT2_UNKNOWN;
		case VFT2_DRV_PRINTER:	return "FileSubtype: " S_VFT2_DRV_PRINTER;
		case VFT2_DRV_KEYBOARD:	return "FileSubtype: " S_VFT2_DRV_KEYBOARD;
		case VFT2_DRV_LANGUAGE:	return "FileSubtype: " S_VFT2_DRV_LANGUAGE;
		case VFT2_DRV_DISPLAY:	return "FileSubtype: " S_VFT2_DRV_DISPLAY;
		case VFT2_DRV_MOUSE:	return "FileSubtype: " S_VFT2_DRV_MOUSE;
		case VFT2_DRV_NETWORK:	return "FileSubtype: " S_VFT2_DRV_NETWORK;
		case VFT2_DRV_SYSTEM:	return "FileSubtype: " S_VFT2_DRV_SYSTEM;
		case VFT2_DRV_INSTALLABLE:return "FileSubtype: " S_VFT2_DRV_INSTALLABLE;
		case VFT2_DRV_SOUND:	return "FileSubtype: " S_VFT2_DRV_SOUND;
		case VFT2_DRV_COMM:		return "FileSubtype: " S_VFT2_DRV_COMM;
		case VFT2_DRV_INPUTMETHOD:return "FileSubtype: " S_VFT2_DRV_INPUTMETHOD;
		default: s[0] = '\0'; sprintf(s, "Unknown FileSubtype: %x", dwFileSubtype); return s;
		}
		break;

	case VFT_FONT:
		switch(dwFileSubtype) {
		case VFT2_FONT_RASTER:	return "FileSubtype: " S_VFT2_FONT_RASTER;
		case VFT2_FONT_VECTOR:	return "FileSubtype: " S_VFT2_FONT_VECTOR;
		case VFT2_FONT_TRUETYPE:return "FileSubtype: " S_VFT2_FONT_TRUETYPE;
		default: s[0] = '\0'; sprintf(s, "Unknown FileSubtype: %x", dwFileSubtype); return s;
		}
		break;

	default: s[0] = '\0'; if (dwFileSubtype) sprintf(s, ", FileSubtype: %x", dwFileSubtype); return s;
	}
}
// ----------------------------------------------------------------------------

void showFIXEDFILEINFO(VS_FIXEDFILEINFO* pValue) 
{
	ASSERT(VS_FFI_SIGNATURE == pValue->dwSignature);
	ASSERT(VS_FFI_STRUCVERSION == pValue->dwStrucVersion);

	// dump the VS_FIXEDFILEINFO numbers
	printf("  Signature:       %08x\n"
				, pValue->dwSignature
//				, (VS_FFI_SIGNATURE == pValue->dwSignature) ? "" : " (expected " S_VS_FFI_SIGNATURE
				);
	printf("  StrucVersion:    %d.%d\n"
				, pValue->dwStrucVersion >> 16, pValue->dwStrucVersion & 0xFFFF);
	printf("  FileVersion:     %d.%d.%d.%d\n"
				, pValue->dwFileVersionMS >> 16, pValue->dwFileVersionMS & 0xFFFF
				, pValue->dwFileVersionLS >> 16, pValue->dwFileVersionLS & 0xFFFF);
	printf("  ProductVersion:  %d.%d.%d.%d\n"
				, pValue->dwProductVersionMS >> 16, pValue->dwProductVersionMS & 0xFFFF
				, pValue->dwProductVersionLS >> 16, pValue->dwProductVersionLS & 0xFFFF);
	printf("  FileFlagsMask:   %s%x\n"
				, pValue->dwFileFlagsMask ? "0x" : ""
				, pValue->dwFileFlagsMask);
	if (pValue->dwFileFlags)
	 printf("  FileFlags:       0x%x (%s)\n"
				, pValue->dwFileFlags
				, showFileFlags(pValue->dwFileFlags));
	else 
	 printf("  FileFlags:       0\n");
	printf("  FileOS:          %s\n"
				, showFileOS(pValue->dwFileOS));
	printf("  FileType:        %s%s\n" //FileSubtype
				, showFileType(pValue->dwFileType)
				, showFileSubtype(pValue->dwFileType, pValue->dwFileSubtype));
	printf("  FileDate:        %x.%x\n"
				, pValue->dwFileDateMS, pValue->dwFileDateLS);
}
// ----------------------------------------------------------------------------

struct VS_VERSIONINFO { 
  WORD  wLength; 
  WORD  wValueLength; 
  WORD  wType; 
  WCHAR szKey[1]; 
  WORD  Padding1[1]; 
  VS_FIXEDFILEINFO Value; 
  WORD  Padding2[1]; 
  WORD  Children[1]; 
};

struct String { 
  WORD   wLength; 
  WORD   wValueLength; 
  WORD   wType; 
  WCHAR  szKey[1]; 
  WORD   Padding[1]; 
  WORD   Value[1]; 
}; 

struct StringTable { 
  WORD   wLength; 
  WORD   wValueLength; 
  WORD   wType; 
  WCHAR  szKey[1]; 
  WORD   Padding[1]; 
  String Children[1]; 
};

struct StringFileInfo { 
  WORD        wLength; 
  WORD        wValueLength; 
  WORD        wType; 
  WCHAR       szKey[1]; 
  WORD        Padding[1]; 
  StringTable Children[1]; 
};

struct Var { 
  WORD  wLength; 
  WORD  wValueLength; 
  WORD  wType; 
  WCHAR szKey[1]; 
  WORD  Padding[1]; 
  DWORD Value[1]; 
}; 

struct VarFileInfo { 
  WORD  wLength; 
  WORD  wValueLength; 
  WORD  wType; 
  WCHAR szKey[1]; 
  WORD  Padding[1]; 
  Var   Children[1]; 
}; 

// ----------------------------------------------------------------------------

int showVer(void* pVer, DWORD size)
{
	// Interpret the VS_VERSIONINFO header pseudo-struct
	VS_VERSIONINFO* pVS = (VS_VERSIONINFO*)pVer;
#define roundoffs(a,b,r)	(((byte*)(b) - (byte*)(a) + ((r)-1)) & ~((r)-1))
#define roundpos(b, a, r)	(((byte*)(a))+roundoffs(a,b,r))
//	byte* nEndRaw   = roundpos((((byte*)pVer) + size), pVer, 4);
//	byte* nEndNamed = roundpos((((byte*) pVS) + pVS->wLength), pVS, 4);
//	ASSERT(nEndRaw == nEndNamed); // size reported from GetFileVersionInfoSize is much padded for some reason...

	ASSERT(!wcscmp(pVS->szKey, L"VS_VERSION_INFO"));
	printf(" (type:%d)\n", pVS->wType);
	byte* pVt = (byte*) &pVS->szKey[wcslen(pVS->szKey)+1];
	VS_FIXEDFILEINFO* pValue = (VS_FIXEDFILEINFO*) roundpos(pVt, pVS, 4);
	if (pVS->wValueLength) {
		showFIXEDFILEINFO(pValue);	// Show the 'Value' element
	}
	// Iterate over the 'Children' elements of VS_VERSIONINFO (either StringFileInfo or VarFileInfo)
	StringFileInfo* pSFI = (StringFileInfo*) roundpos(((byte*)pValue) + pVS->wValueLength, pValue, 4);
	for ( ; ((byte*) pSFI) < (((byte*) pVS) + pVS->wLength); pSFI = (StringFileInfo*)roundpos((((byte*) pSFI) + pSFI->wLength), pSFI, 4)) { // StringFileInfo / VarFileInfo
		if (!wcscmp(pSFI->szKey, L"StringFileInfo")) {
			// The current child is a StringFileInfo element
			ASSERT(1 == pSFI->wType);
			ASSERT(!pSFI->wValueLength);
			// Iterate through the StringTable elements of StringFileInfo
			StringTable* pST = (StringTable*) roundpos(&pSFI->szKey[wcslen(pSFI->szKey)+1], pSFI, 4);
			for ( ; ((byte*) pST) < (((byte*) pSFI) + pSFI->wLength); pST = (StringTable*)roundpos((((byte*) pST) + pST->wLength), pST, 4)) {
				printf(" LangID: %S\n", pST->szKey);
				ASSERT(!pST->wValueLength);
				// Iterate through the String elements of StringTable
				String* pS = (String*) roundpos(&pST->szKey[wcslen(pST->szKey)+1], pST, 4);
				for ( ; ((byte*) pS) < (((byte*) pST) + pST->wLength); pS = (String*) roundpos((((byte*) pS) + pS->wLength), pS, 4)) {
					wchar_t* psVal = (wchar_t*) roundpos(&pS->szKey[wcslen(pS->szKey)+1], pS, 4);
					printf("  %-18S: %.*S\n", pS->szKey, pS->wValueLength, psVal); // print <sKey> : <sValue>
				}
			}
		}
		else {
			// The current child is a VarFileInfo element
			ASSERT(1 == pSFI->wType); // ?? it just seems to be this way...
			VarFileInfo* pVFI = (VarFileInfo*) pSFI;
			ASSERT(!wcscmp(pVFI->szKey, L"VarFileInfo"));
			ASSERT(!pVFI->wValueLength);
			// Iterate through the Var elements of VarFileInfo (there should be only one, but just in case...)
			Var* pV = (Var*) roundpos(&pVFI->szKey[wcslen(pVFI->szKey)+1], pVFI, 4);
			for ( ; ((byte*) pV) < (((byte*) pVFI) + pVFI->wLength); pV = (Var*)roundpos((((byte*) pV) + pV->wLength), pV, 4)) {
				printf(" %S: ", pV->szKey);
				// Iterate through the array of pairs of 16-bit language ID values that make up the standard 'Translation' VarFileInfo element.
				WORD* pwV = (WORD*) roundpos(&pV->szKey[wcslen(pV->szKey)+1], pV, 4);
				for (WORD* wpos = pwV ; ((byte*) wpos) < (((byte*) pwV) + pV->wValueLength); wpos+=2) {
					printf("%04x%04x ", (int)*wpos++, (int)(*(wpos+1)));
				}
				printf("\n");
			}
		}
	}
	ASSERT((byte*) pSFI == roundpos((((byte*) pVS) + pVS->wLength), pVS, 4));
	return pValue->dwFileVersionMS; // !!! return major version number
}
// ----------------------------------------------------------------------------

int wmain(int argc, wchar_t *argv[], wchar_t *envp[])
// Prints out the version info of the file named in argv[1], and returns the major version number as the exit code
{
	if (argc <= 1) return usage();

	wchar_t* sfnFile = argv[1];
	DWORD dummy;
	DWORD size = GetFileVersionInfoSizeW(sfnFile, &dummy);
	if (!size) return error(sfnFile);
	void* pVer = _alloca(size);  memset(pVer, 0, size);
	if (0 == GetFileVersionInfoW(sfnFile, 0, size, pVer)) return error(sfnFile);
#if HDUMP
	printf("VERSIONINFO dump for file \"%S\":\n", sfnFile);
	hdump((byte*) pVer, size, 0, 0);
#endif // HDUMP
	printf("VERSIONINFO for file \"%S\": ", sfnFile);
	return showVer(pVer, size);
}
// ----------------------------------------------------------------------------

