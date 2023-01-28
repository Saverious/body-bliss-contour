const{transports,createLogger,format} = require('winston');

exports.logging=createLogger({
    transports:[
        new transports.File({
            filename:'bbc-info-logs.log',
            level:'info',
            format:format.combine(format.timestamp(),format.json())
        }),
        
        new transports.File({
            filename:'bbc-error-logs.log',
            level:'error',
            format:format.combine(format.timestamp(),format.json())
        }),
        
        new transports.Console({
            level:'info',
            format:format.simple()
        }),
        new transports.Console({
            level:'error',
            format:format.simple()
        })
    ]
});