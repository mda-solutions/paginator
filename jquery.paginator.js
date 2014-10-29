/*
 * jquery.wikify
 *
 * Copyright (c) 2013 moises.rangel@gmail.com
 *
 * Licensed under MIT
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Launch      : October 2014
 * Version     : .01-beta1
 * Dependencies: qtip (http://qtip2.com/)
 */

(function($)
{
	 $.fn.paginator = function(options)
	 {

	 	var self				= $(this);
		var itemCollection 		= self.children();
		var itemsContainer 		= self;
		var pageItemsContainer	= options.pageItemsContainer;
		var itemsPerPage   		= options.itemsPerPage;
		var itemsPerNav			= options.itemsPerNav;
		var paginationitemsUI 	= [];
		var isprevui            = false;
		var prevornext          = undefined;

		var currentpageitem     = 1;
		var linktemplate        = "<a href=\"javascript:void(0)\" data-item=\"#DATAITEM#\" class=\"paginationitem\">#NUMBER#</a>";
		var nexttemplate    	= "<a href=\"javascript:void(0)\" data-item=\"#DATAITEM#\" class=\"nextpage\">#NUMBER#</a>"
		var prevtemplate 	    = "<a href=\"javascript:void(0)\" data-item=\"#DATAITEM#\" class=\"prevpage\">#NUMBER#</a>"

		var buildNavigation = function()
		{
			if(pageItemsContainer.length > 0)
			{
				var totalpages      = itemCollection.length / itemsPerPage;
				var iteration_pages = (itemsPerNav == 0) ? Math.round(totalpages) : itemsPerNav;

				for (i = 0; i < iteration_pages; i++)
				{
					var pagenumber = i + 1;
					var toappend = linktemplate.replace("#NUMBER#", pagenumber);
					var toappend = toappend.replace("#DATAITEM#", pagenumber);
					pageItemsContainer.append(toappend);
					if(pagenumber == 1)
					{
						$('.paginationitem').addClass('active');
					}

					paginationitemsUI[i] = pagenumber;
				}

				var lastpageui = paginationitemsUI[paginationitemsUI.length - 1];
				if(lastpageui < Math.round(totalpages))
				{
					var toappend = nexttemplate.replace("#NUMBER#", ">");
					var toappend = toappend.replace("#DATAITEM#", "9999");
					pageItemsContainer.append(toappend);

					//set nextaction
					$('.nextpage').click(nextpage);
				}

				$('.paginationitem').click(showPageFromNumber);
				return;
			}
		}

		var prevpage = function(e)
		{
			prevornext = 'prev';
			var pageitems   = $('.paginationitem');
			currentpageitem = parseInt(currentpageitem) - 1;
			pageitems.removeClass('active');
			showPage(false);
			rebuildNavigation(e);
			isFirstPage();
		}

		var nextpage = function(e)
		{
			prevornext = 'next';
			var pageitems = $('.paginationitem');
			currentpageitem = parseInt(currentpageitem) + 1;
			pageitems.removeClass('active');
			showPage(false);
			rebuildNavigation(e);
			isLastPage();
		}

		var isFirstPage = function()
		{
			if(currentpageitem == 1)
			{
				$('.prevpage').hide();
			}
		}

		var isLastPage = function ()
		{
			var totalpages      = itemCollection.length / itemsPerPage;
			if(currentpageitem == Math.round(totalpages))
			{

				$('.nextpage').hide();
			}
		}

		var rebuildNavigation = function(e)
		{
			$('.paginationitem').remove();
			$('a[data-item='+currentpageitem+']').addClass('active');

			var iteration_pages = (itemsPerNav == 0) ? Math.round(totalpages) : itemsPerNav;
			var currenttarget   = $(e.currentTarget);

			for (i = currentpageitem; i < (iteration_pages + currentpageitem); i++)
			{
				var pagenumber = i;
				var toappend   = linktemplate.replace("#NUMBER#", pagenumber);
				var toappend   = toappend.replace("#DATAITEM#", pagenumber);

				if(prevornext == 'next')
				{
					$(e.currentTarget).before(toappend);
				}

				if(prevornext == 'prev')
				{
					$(e.currentTarget).after(toappend);
				}

				if(pagenumber == 1)
				{
					$('.paginationitem').addClass('active');
				}

				paginationitemsUI[i] = pagenumber;
			}

			if(prevornext == 'prev')
			{
				var pages = $('.paginationitem').get().reverse();
				$('.paginationitem').remove();
				$(e.currentTarget).after(pages);
				$('.paginationitem').show();
			}

			if(currentpageitem > 1)
			{
				$('.prevpage').show();

				var toappend = prevtemplate.replace("#NUMBER#", "<");
				var toappend = toappend.replace("#DATAITEM#", "0000");

				if(!isprevui)
				{
					pageItemsContainer.children().first().before(toappend);
					isprevui = true;
				}

				$('.prevpage').unbind().click(prevpage);
			}

			$('.paginationitem').click(showPageFromNumber);
		}

		var showPageFromNumber = function(e)
		{
			var pageitems = $('.paginationitem');
			if(pageitems.length > 0)
			{
				var clickeditem = $(e.currentTarget);

				pageitems.removeClass('active');
				clickeditem.addClass('active');
				currentpageitem = $(e.currentTarget).attr('data-item');

				showPage(false);
			}
		}

		var showPage = function(isfirst)
		{
			if(itemCollection.length > 0)
			{
				//show first page
				itemCollection.hide();
				var contpages = 0;
				if(isfirst)
				{
		 			$.each(itemCollection, function(key, item)
					{
						var totalitems = currentpageitem * itemsPerPage

						if(contpages < totalitems)
						{
							$(item).show();
						}

						contpages ++;
					});
					return;
				}

				//from pagination

	 			var lastitem   = currentpageitem * itemsPerPage;
	 			var firstelement = lastitem - itemsPerPage;

	 			itemCollection.hide();
	 			$.each(itemCollection, function(key, item)
				{
					if(contpages > firstelement )
					{
						if(contpages < lastitem + 1)
						{
							$(item).show();
						}
					}

					contpages++;
				});
			}

		}

		showPage(true);
		buildNavigation();
	 }

}(jQuery));