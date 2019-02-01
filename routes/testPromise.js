

/**
Callback 
**/

const functionCallback = (callback) => {
setTimeout(function(args) {
	console.log("hello 1");
	callback();
},3000);
console.log("hello 2")
};
functionCallback(function(){
	console.log("hello from callback");
	  functionWithPromise()
});
/**
Promise 
**/
const functionWithPromise = () => {
setTimeout(function(args) {
	console.log("hello 1");
	 Promise.resolve();
},3000);
console.log("hello 2");
}
/**
Promise with async await 
**/