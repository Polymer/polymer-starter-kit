#ifndef _SAUCECONNECT_H
#define _SAUCECONNECT_H

#include <stddef.h>

/*
 * The definition of this structure is hidden from the API to be able to
 * provide ABI compatibility if our Sauce Connect implementation changes. Use
 * sc_new() and sc_free() to create/free it.
 */
struct sc_ctx;

/*
 * Create/free a new Sauce Connect context. This can be called multiple times
 * to create independent instances, to e.g. use multiple accounts.
 */
struct sc_ctx *sc_new(void);
void sc_free(struct sc_ctx *ctx);

/*
 * Setter/getter for configuration parameters. vlen is the size of value. Do
 * this before calling sc_init().
 */
#define SC_PARAM_IS_SERVER 0x01     /* int */
#define SC_PARAM_KGP_HOST 0x02      /* char * */
#define SC_PARAM_KGP_PORT 0x03      /* int */
#define SC_PARAM_EXT_HOST 0x04      /* char * */
#define SC_PARAM_EXT_PORT 0x05      /* int */
#define SC_PARAM_CERTFILE 0x06      /* char * */
#define SC_PARAM_KEYFILE 0x07       /* char * */
#define SC_PARAM_LOCAL_PORT 0x08    /* int */
#define SC_PARAM_USER 0x09          /* char * */
#define SC_PARAM_API_KEY 0x0a       /* char * */
#define SC_PARAM_PROXY 0x0b         /* char * */
#define SC_PARAM_PROXY_USERPWD 0x0c /* char * */
#define SC_PARAM_RECONNECT 0x0d     /* int */
#define SC_PARAM_DNS_SERVERS 0x0e   /* char * */
int sc_get(struct sc_ctx *ctx, int param, void *value, size_t vlen);
int sc_set(struct sc_ctx *ctx, int param, void *value);

/*
 * Once we have set up our ctx, do some initialization. This makes sure
 * everything is ready to start a new connection. Do this only after
 * parameters are set via sc_set().
 */
int sc_init(struct sc_ctx *ctx);

/*
 * Run the main event loop: connect to the peer, and start forwarding. Only
 * returns if sc_stop() is called from another thread, or a fatal error
 * happens Sauce Connect can't recover from.
 */
int sc_run(struct sc_ctx *ctx);

/*
 * Stop the Sauce Connect main event loop. This can be used from e.g. another
 * thread to stop SC in a clean way.
 */
int sc_stop(struct sc_ctx *ctx);

/*
 * Get the current status of Sauce Connect.
 */
#define SC_STATUS_RUNNING 0x01
#define SC_STATUS_EXITING 0x02
#define SC_STATUS_STOPPED 0x03
int sc_status(struct sc_ctx *ctx);

/*
 * Get information on Sauce Connect internals.
 */
#define SC_INFO_KGP_IS_CONNECTED 0x01
#define SC_INFO_KGP_LAST_STATUS_CHANGE 0x02
int sc_get_info(struct sc_ctx *ctx, int what, int *info);

/*
 * Set a log callback the library will call when logging messages.
 */
typedef void (*sc_log_cb)(int severity, const char *msg);

void sc_set_log_fn(sc_log_cb cb);

#define SC_EXITCODE_UNKNOWN 0
#define SC_EXITCODE_ALLOC_ERROR 1
#define SC_EXITCODE_LOCAL_LISTEN_ERROR 2
#define SC_EXITCODE_LOCAL_ACCEPT_ERROR 3
#define SC_EXITCODE_KGP_INVALID_PACKET 4
#define SC_EXITCODE_KGP_CONNECT_ERROR 5
#define SC_EXITCODE_KGP_CONNECTION_CLOSED 6
#define SC_EXITCODE_KGP_LISTEN_ERROR 7
#define SC_EXITCODE_CMD_STOP 8
#define SC_EXITCODE_CMD_SOCKET_ERROR 9
#define SC_EXITCODE_CMD_CONNECTION_CLOSED 10
#define SC_EXITCODE_DNS_RESET_ERROR 11
int sc_error(struct sc_ctx *ctx);

static inline char *sc_err2str(int exitcode)
{
    switch (exitcode) {
        case SC_EXITCODE_UNKNOWN:
            return "Unknown error or no error occured";
            break;
        case SC_EXITCODE_ALLOC_ERROR:
            return "Allocation failed - out of memory?";
            break;
        case SC_EXITCODE_LOCAL_LISTEN_ERROR:
            return "Failed to start Selenium listener. "
                "Please make sure there are no other applications using "
                "the Selenium port, or specify an alternative port for "
                "Sauce Connect via the --se-port option";
            break;
        case SC_EXITCODE_LOCAL_ACCEPT_ERROR:
            return "Failed to accept Selenium connection";
            break;
        case SC_EXITCODE_KGP_INVALID_PACKET:
            return "Invalid KGP packet received";
            break;
        case SC_EXITCODE_KGP_CONNECT_ERROR:
            return "KGP connection error";
            break;
        case SC_EXITCODE_KGP_CONNECTION_CLOSED:
            return "KGP connection closed from the other side";
            break;
        case SC_EXITCODE_KGP_LISTEN_ERROR:
            return "Failed to start KGP listener";
            break;
        case SC_EXITCODE_CMD_STOP:
            return "Terminated";
            break;
        case SC_EXITCODE_CMD_SOCKET_ERROR:
            return "Internal error: command socket failure";
            break;
        case SC_EXITCODE_CMD_CONNECTION_CLOSED:
            return "Internal error: command socket closed";
            break;
        case SC_EXITCODE_DNS_RESET_ERROR:
            return "DNS reset failed";
            break;
        default:
            return "Invalid exit code";
            break;
    }
}

/*
 * Enable SSL verification for KGP. This is the default.
 */
void sc_ssl_enable_verification(void);

/*
 * Disable SSL verification for KGP. This is the default.
 */
void sc_ssl_disable_verification(void);

#endif
