var NS = CQ.Ext.namespace('app.cqcomponents.components');

// config
NS.TREETEST_HEIGHT = 200;
NS.TREETEST_GROUPDD = 'TreeTestDD';

NS.TreeTest = CQ.Ext.extend(CQ.Ext.Panel, {
	
	initComponent: function () {
		NS.TreeTest.superclass.initComponent.call(this);
		
		
		var treePanel = new CQ.Ext.tree.TreePanel({
			ddGroup: NS.TREETEST_GROUPDD,
			width: CQ.themes.TagAdmin.TREE_WIDTH,
			height: NS.TREETEST_HEIGHT,
			border:false,
            autoScroll: true,
            containerScroll: true,
			bodyStyle: 'background: none',
			rootVisible: false,
			enableDrag: true,
			loader: {
				dataUrl:CQ.HTTP.externalize("/bin/wcm/siteadmin/tree.json"),
				requestMethod:"GET",
				// request params
				baseParams: {
					"_charset_": "utf-8"
				},
				// change request params before loading
				listeners: {
					beforeload: function(loader, node) {
						this.baseParams.path = node.getPath();
					}
				},
				// attributes for all nodes created by the loader
				baseAttrs: {
					singleClickExpand: true,
					iconCls: 'page',
					draggable: true
				}
			},

			// CQ.Ext.tree.TreeNode config
			root: {
				nodeType: "async",
				text: CQ.I18n.getMessage("i18n-enabled - ROOT - The Great Matt Lo"),
				name: "/content",
				expanded: true,
				draggable: false
			}
		});
		
		
		var container = new CQ.Ext.Panel({
			"layout": "column",
            "bodyStyle": ""
		});	
		
		var lineRenderer = function(value, metadata, record) {
//			if (record.data.deleted) {
//				metadata.attr = 'style="color:grey;"';
//			}
//			var comment = record.data.comment;
//			if (comment) {
//				comment = CQ.Ext.util.Format.htmlEncode(comment);
//				if (CQ.Ext.QuickTips.isEnabled()) {
//					metadata.attr += ' ext:qtip="' + comment + '"';
//				} else {
//					metadata.attr += ' title="' + comment + '"';
//				}
//			}
			console.log(value, metadata, record);
			
			return value;
		};
		
		var myData = [
		  ['3m Co',71.72,0.02,0.03,'9/1 12:00am'],
		  ['Alcoa Inc',29.01,0.42,1.47,'9/1 12:00am'],
		  ['Wal-Mart Stores, Inc.',45.45,0.73,1.63,'9/1 12:00am'],
		  ['Walt Disney Company (The) (Holding Company)',29.89,0.24,0.81,'9/1 12:00am']
		];

		var store = new CQ.Ext.data.Store({
			proxy: new CQ.Ext.data.MemoryProxy(myData),
			reader: new CQ.Ext.data.ArrayReader({}, [
				{name: 'name'},
				{name: 'path', type: 'float'}
			])
		});
		store.load();
		
		var gridView = new CQ.Ext.grid.GridPanel({
			ddGroup: NS.TREETEST_GROUPDD,
            border :false,
            columnWidth: 1,
			style: 'height: ' + NS.TREETEST_HEIGHT + 'px;',
            autoHeight: true,
            loadMask: true,
            stripeRows: true,
            autoExpandColumn: "path",
			enableColumnMove: false,
			enableDragDrop: false,
			sm: new CQ.Ext.grid.RowSelectionModel({singleSelect: true}),
            cm :new CQ.Ext.grid.ColumnModel([
                {
                    "header":CQ.I18n.getMessage("Name"),
                    "dataIndex":"name",
                    "sortable": true,
                    "width": 100,
                    "renderer":lineRenderer
                },
                {
                    "id": "path",
                    "header":CQ.I18n.getMessage("Path"),
                    "dataIndex":"path",
                    "sortable": true,
                    "renderer":lineRenderer // todo: render nice date
                }
            ]),
            store: store,
            enableHdMenu: false,
			listeners: {
				render: function () {

					var testdd = new CQ.Ext.dd.DropTarget(this.getEl(),
					{
						ddGroup: NS.TREETEST_GROUPDD,
						grid: this,

						notifyDrop: function(dd, e, data)
						{
							alert('test');
						}
					});
				}
			}
        });	
		container.add(treePanel);
		container.add(gridView);
		
		this.add(container);
		
	}
});

CQ.Ext.reg('treetest', NS.TreeTest);