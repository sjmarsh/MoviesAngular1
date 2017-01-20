# Movies - Angular 1 #

Front-end for [https://github.com/sjmarsh/MoviesNetCore](https://github.com/sjmarsh/MoviesNetCore "https://github.com/sjmarsh/MoviesNetCore") created using angular 1.5.8. 

Explores:  
- angular js  
- gulp js  
- Deploying an angular application to aws using an S3 bucket  

## Setup: ##
</br>
- Clone the repo from GitHub  
- Run npm install  
- run gulp  
- Start the app using: npm run app

## Deployment: ##
</br>
- npm run publish  
(Uses an npm script taks to call gulp --production && gulp publish)


## References: ##
</br>
[https://github.com/gulpjs/gulp/tree/master/docs/recipes](https://github.com/gulpjs/gulp/tree/master/docs/recipes "https://github.com/gulpjs/gulp/tree/master/docs/recipes")
</br>
[https://www.linkedin.com/pulse/three-easy-ways-deploy-angular-app-free-david-meza](https://www.linkedin.com/pulse/three-easy-ways-deploy-angular-app-free-david-meza "https://www.linkedin.com/pulse/three-easy-ways-deploy-angular-app-free-david-meza")
</br>
[http://docs.aws.amazon.com/powershell/latest/userguide/pstools-s3-upload-object.html](http://docs.aws.amazon.com/powershell/latest/userguide/pstools-s3-upload-object.html "http://docs.aws.amazon.com/powershell/latest/userguide/pstools-s3-upload-object.html")
</br>
[https://www.npmjs.com/package/ng-infinite-scroll](https://www.npmjs.com/package/ng-infinite-scroll "https://www.npmjs.com/package/ng-infinite-scroll")
</br>
[https://www.npmjs.com/package/gulp-ng-config](https://www.npmjs.com/package/gulp-ng-config "https://www.npmjs.com/package/gulp-ng-config")

## TODO: ##
</br>
- <del>Manage state between navigation (ie. remember search results)</del>  
- <del>Get movies by category</del>  
- <del>Infinite scroll</del>  
- <del>Better style for search box</del>   
- <del>Fix android - hide keyboard when 'Enter' pressed for search</del>  
- <del>Dev vs Prod deployment configuration</del>  
- <del>Add/Edit gulp to allow for local vs prod builds</del>  
- <del>Automate deployment to aws</del>  
- <del>Automated unit tests</del>  
- Minify html?  
- Use image urls for each movie as background image (instead of default background)  
- Create a similar app using Angular 2  