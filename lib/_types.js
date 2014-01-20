types = {
	folder: {
		name: 'folder',
		list: {
			types: ['page', 'folder']
		}
	},

	page: {
		name: 'page',
		list: {
			types: ['*']
		}
	},

	list: {
		name: 'list',
		list: {
			types: ['*']
		}
	},

	section_hero: {
		name: 'section_hero',
		is: ['page_section', 'block_element', 'html_element'],
		children: {
			image: {
				types: ['image'],
				hints: {image: {min_width: 2000, min_height: 1000}}
			},
			header: {
				types: ['text']
			},
			subhead: {
				types: ['text']
			}
		}
	},

	section_tiles: {
		name: 'section_tiles',
		is: ['page_section', 'block_element', 'html_element'],
		children: {
			title: {
				types: ['text'],
				validation: { min_length: 5, max_length: 30 }
			},
			tiles: {
				types: ['list'],
				hints: {list: {types: ['image_block', 'tile'], max: 4}, block_element: {fixed_width: 200}}
			}
		}
	},

	sidebar: {
		name: 'sidebar',
		is: ['block_element', 'html_element'],
		children: {
			title: {
				types: ['text'],
				validation: { min_length: 5, max_length: 30 }
			},
			image: {
				types: ['image_block'],
				hints: {image: {fixed_width: 400}}
			},
			body: {
				types: ['html'],
				validation: { max_length: 100 }
			}
		}
	},

	tile: {
		name: 'tile',
		is: ['block_element', 'html_element'],
		children: {
			title: {
				types: ['text'],
				validation: { max_length: 20 }
			},
			image: {
				types: ['image_block']
			}
		}
	},

	video_tile: {
		name: 'video_tile',
		is: ['tile', 'block_element', 'html_element'],
		children: {
			title: {
				types: ['text'],
				validation: { max_length: 20 }
			},
			image: {
				types: ['image']
			},
			youtube: {
				types: ['youtube']
			}
		}
	},

	youtube: {
		name: 'youtube',
		is: ['block_element', 'html_element'],
		attributes: {
			native_width: {
				type: 'int'
			},
			native_height: {
				type: 'int'
			}
		},
		children: {
			id: {
				types: ['text'],
				validation: { min_length: 10, max_length: 10 }
			}
		}
	},

	image_link: {
		name: 'image_link',
		is: ['image_block', 'block_element', 'html_element'],
		children: {
			image: {
				types: ['image']
			},
			link: {
				types: ['text']
			}
		}
	},

	image: {
		name: 'image',
		is: ['image_block', 'block_element', 'html_element'],
		attributes: {
			width: {
				type: 'int'
			},
			height: {
				type: 'int'
			},
			url: {
				type: 'string',
				validation: { url: true }
			}
		}
	},

	translated_image: {
		name: 'translated_image',
		is: ['image', 'image_block', 'block_element', 'html_element'],
		attributes: {
			width: {
				type: 'int'
			},
			height: {
				type: 'int'
			}
		},
		children: {
			url: {
				types: ['list'],
				hints: {
					list: {types: ['manual_translation_snipet']},
					manual_translation_snipet: {validation: { url: true }}
				}
			}
		}
	},

	markdown: {
		name: 'markdown',
		is: ['html'],
		attributes: {
			markdown: {
				type: 'string',
				multiline: true
			}
		},
		children: {
			html: {
				types: ['html']
			}
		}
	},

	html: {
		name: 'html',
		children: {
			html: {
				types: ['text'],
				multiline: true
			}
		}
	},

	smartling_translation: {
		name: 'smartling_translation',
		is: ['text'],
		attributes: {
			text: {
				type: 'string'
			},
			translation_notes: {
				type: 'string'
			},
			translation_id: {
				type: 'string'
			},
			translation_languages: {
				type: 'string',
				validation: { comma_seperated_strings: true }
			}
		}
	},

	manual_translation: {
		name: 'manual_translation',
		is: ['text'],
		attributes: {
			international: {
				type: 'string'
			}
		},
		children: {
			translations: {
				types: ['list'],
				hints: {list: {types: ['manual_translation_snipet']}}
			}
		}
	},

	manual_translation_snipet: {
		name: 'manual_translation_snipet',
		attributes: {
			language: {
				type: 'string'
			},
			text: {
				type: 'string'
			}
		}
	},

	text: {
		name: 'text',
		attributes: {
			text: {
				type: 'string'
			}
		}
	}

};

typesArray = [];
var i = 1;

_.each(types, function(type) {
	typesArray.push(type);
	type._id = i++;
	if (type.attributes) {
		type.attributeArray = [];
		_.each(type.attributes, function(attribute, key) {
			attribute.name = key;
			attribute._id = i++;
			type.attributeArray.push(attribute);
		});
	}
	if (type.children) {
		type.childArray = [];
		_.each(type.children, function(child, key) {
			if (child.types) {
				//_.each(child.types, function(value, key) {
				//	if (typeof(value) == 'string') {
				//		child.types[key] = {type: value}
				//	}
				//});
			}
			child.name = key;
			child._id = i++;
			type.childArray.push(child);
		});
	}
});
