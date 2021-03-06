(function (Vue) {

	const pad = (num, n) => (Array(n).join(0)+num).slice(-n)
	const convertDuration = (second) => {
		const h=Math.floor(second/3600)
		const m=Math.floor(second%3600/60)
		const s=Math.floor(second%60)

		return h? pad(h,2)+':'+pad(m,2)+':'+pad(s,2) : pad(m,2)+':'+pad(s,2)
    }
	
	var loadTemplate = function (name) {
		return document.getElementById(name+'_tmp1').innerHTML
	}

	// 定义组件
	var Home = Vue.extend({
	    template: loadTemplate('home')
	})

	var List = Vue.extend({
	    template: loadTemplate('list'),
	    data: function () {
	    	//jsonp
	    	this.$http.jsonp('http://127.0.0.1:2080/api/music').then(res => {
	    		this.list = res.data
	    	}, function() {alert('出错了！')})
	    	return {
	    		list: []
	    	}
	    },
	    methods: {
	    	pad : pad,
	    	convert: convertDuration
	    }
	})

	var Item = Vue.extend({
	    template: loadTemplate('item'),
	    data: function () {
	    	return {
	    		item: {}
	    	}
	    },
	    route: {
	    	data: function (transition) {
	    		//取得路由信息
	    		var id = parseInt(transition.to.params.id)
	    		if (!id) {
	    			//如果id不合法
	    			route.go('/home')
	    			return
	    		}
	    		this.$http.jsonp('http://127.0.0.1:2080/api/music/'+id).then(res => {
	    			this.item = res.data
	    		}, function() {alert('出错了！')})
	    		
	    		return {
	    			item: {}
	    		}
	    	}
	    },
	    methods: {
	    	pad : pad,
	    	convert: convertDuration
	    }
	})

	// 路由器需要一个根组件。
	// 出于演示的目的，这里使用一个空的组件，直接使用 HTML 作为应用的模板
	var App = Vue.extend({})

	// 创建一个路由器实例
	// 创建实例时可以传入配置参数进行定制，为保持简单，这里使用默认配置
	var router = new VueRouter()

	// 定义路由规则
	// 每条路由规则应该映射到一个组件。这里的“组件”可以是一个使用 Vue.extend
	// 创建的组件构造函数，也可以是一个组件选项对象。
	// 稍后我们会讲解嵌套路由
	router.map({
	    '/home': {
	    	name: 'home',
	        component: Home
	    },
	    '/songs': {
	    	name: 'list',
	        component: List
	    },
	    '/songs/:id': {
	    	name: 'item',
	        component: Item
	    }
	})
    //任意其他地址跳转到home
	router.redirect({'*':'/home'})

	// 现在我们可以启动应用了！
	// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
	router.start(App, '#app')
}) (Vue)




