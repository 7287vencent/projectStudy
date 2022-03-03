const fs = require('fs')
const { createSideBarConfig } = require("./.vuepress/util.js");
const init = () => {
	const base_path = '/blogs/'
	const base_dir = './blogs'
	const dirs = fs.readdirSync(base_dir)
	const res = {}
	console.log("dir", dirs) 
	for (let dir of dirs) {
		let key_path = base_path + dir 
		let dir2_path = base_dir + '/' + dir

		// ? 遍历二级目录
		const child_dir = fs.readdirSync(dir2_path)

		// ? 判断第一个文件是否是目录
		const stat = fs.statSync(dir2_path + '/' + child_dir[0])
		if (stat.isDirectory()) {
			// console.log("dir有子目录", dir)
			res[key_path] = []

			child_dir.forEach((child) => { res[key_path].push(createSideBarConfig
			(child, key_path + "/" + child)) })
			// ? 生成结果
		} else {
			// console.log("dir里面全是文件", dir)
			// ? 生成结果
			// [MIANSHI6]: [createSideBarConfig("程序员面试金典6", MIANSHI6 + "")]
			res[key_path] = [createSideBarConfig(dir, key_path + "")]
		}
	}

	// console.log(res)
	// fs.writeFileSync('./siderbar.json', JSON.stringify(res))

	// ? 直接覆盖不就行了嘛
	fs.writeFileSync('./.vuepress/siderbar.js', `module.exports = ${JSON.stringify(res)}`)
}

init()

