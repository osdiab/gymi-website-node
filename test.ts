//tslint:disable
/**
 * llllllllol
 */
enum MyEnum {
  a,
  b
}

console.log(
  Object.keys(MyEnum).reduce(
		(memo, key: keyof typeof MyEnum) => {
			return parseInt(key) === NaN ? memo : [...memo, MyEnum[key]];
		},
	 []
	)
);

for (const key in MyEnum) {
	console.log(key);
}