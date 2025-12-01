import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: 'e3e6bbe75e5e431cbe9ffa44061b90a5'
                    }
                    'clv-maximizer-workspace': {
                        table: 'sys_ui_page'
                        id: '2618f7d2f4604c8f8339a9ba5aef710b'
                    }
                    'clv-maximizer/components/DataIngestionTab.css': {
                        table: 'sys_ux_theme_asset'
                        id: 'acd68719fe6d4743956716f731a6bb7d'
                    }
                    'incident-manager-page': {
                        table: 'sys_ui_page'
                        id: 'c932d7417f084df49b5fe0f1ee2a44c0'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '585382828f9f42fe9d1eadf1c72549b8'
                    }
                    src_server_index_js: {
                        table: 'sys_module'
                        id: 'ea790bbfdc3747cea8dc5899dd477738'
                    }
                    'x_hete_clv_maximiz/____insertStyle-BxBLo9PM': {
                        table: 'sys_ux_lib_asset'
                        id: 'ad79ebff7d054776b87ae386ac0e26aa'
                    }
                    'x_hete_clv_maximiz/____insertStyle-BxBLo9PM.js.map': {
                        table: 'sys_ux_lib_asset'
                        id: 'd9faba1053634996bce8c5dc6e1ac050'
                    }
                    'x_hete_clv_maximiz/clv-maximizer/main': {
                        table: 'sys_ux_lib_asset'
                        id: '3e5fc80f3560433589f4fc8696a14069'
                    }
                    'x_hete_clv_maximiz/clv-maximizer/main.js.map': {
                        table: 'sys_ux_lib_asset'
                        id: 'b8a0ce2220424e59adbab3575c723766'
                    }
                    'x_hete_clv_maximiz/main': {
                        table: 'sys_ux_lib_asset'
                        id: '7aecccc1746b4efda5adea5effbb6379'
                    }
                    'x_hete_clv_maximiz/main.js.map': {
                        table: 'sys_ux_lib_asset'
                        id: '4a47707b65a847f4bbb8af4801c0da67'
                    }
                }
                composite: [
                    {
                        table: 'sys_choice'
                        id: '04244905a3bd4a4c947442260ee7d49b'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'status'
                            value: 'closed'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0b34f80af8764983a54c13a039e420ac'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'resolved_at'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1259d26f0fdb470ea32e2dbeabcb3588'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'priority'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1a651eaa87624ff8a45a76d0d163b2bd'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'resolved_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1fa75bd5b27c4d57b6d805c95c746051'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'priority'
                            value: '1'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2f3f33aafcbe48ffb16ab0936ab8ab10'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'status'
                            value: 'new'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3f42f62e9d29477abf08d837b1ed6f2c'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '50377cf3b2d44e67b22cc3dc3b0f4a50'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'priority'
                            value: '3'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '537ff6035d6a48018ca03265600e1191'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'short_description'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '554bc2c9041a436aaadd602c08643c46'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '720b0f5c8e8a46c68d91588f66baf889'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'number'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '74f0997c01c845aeac8d1dbab39692d7'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'priority'
                            value: '2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '868471f69b8f4a81b8e5c1ffe0f21e02'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'priority'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '86ae33c445ba49d68a05d5d2008a6d70'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'priority'
                            value: '4'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '8f570ef5936b4fdaa423d1752650c1f1'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'status'
                            value: 'on_hold'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '90a2f2e0d2ac4e5790b11e92d96827b4'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'priority'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '92808f575eec47988030bf79ba6beb30'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'status'
                            value: 'resolved'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '96b06269bbe842f68d2ebd28600c7526'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '97058fdb4a6a449fa55cef485697dcca'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a3f336c78133416fa1a37db312d6e547'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'opened_at'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a6368168b37a425d954bd4a873df6dcc'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'aeb2a20f6da84f0f83c440290c129690'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c36d2b1b6508443c9d6c9908a015e34c'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'short_description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd256f9a4a7ea402a84c03281b5450011'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'status'
                            value: 'in_progress'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd3b9e85a18d54804848b6fa27e08a622'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_number'
                        id: 'd3c93e1b14fe4a3d817111cc78ba0b72'
                        key: {
                            category: 'x_hete_clv_maximiz_incident'
                            prefix: 'INC'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'da1d621011bf41829f491ad3e8a81e05'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'daa1dc0f20dc4c9896f3a980807c875f'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'description'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'e77026bb71a144ebbaf27713191019c4'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f98065cd16ef4535814b82ceca33fcb4'
                        key: {
                            name: 'x_hete_clv_maximiz_incident'
                            element: 'opened_at'
                            language: 'en'
                        }
                    },
                ]
            }
        }
    }
}
