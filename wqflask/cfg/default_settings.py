LOGFILE = """/tmp/flask_gn_log"""

#This is needed because Flask turns key errors into a
#400 bad request response with no exception/log
TRAP_BAD_REQUEST_ERRORS = True

# http://pythonhosted.org/Flask-Security/configuration.html
SECURITY_CONFIRMABLE = True
SECURITY_TRACKABLE = True
SECURITY_REGISTERABLE = True
SECURITY_RECOVERABLE = True

SECURITY_EMAIL_SENDER = "no-reply@genenetwork.org"

SECURITY_POST_LOGIN_VIEW = "/thank_you"

SQLALCHEMY_POOL_RECYCLE = 3600

SECURITY_PASSWORD_HASH = "bcrypt"
SESSION_TYPE = "filesystem"
SECRET_KEY = "secretkey"
