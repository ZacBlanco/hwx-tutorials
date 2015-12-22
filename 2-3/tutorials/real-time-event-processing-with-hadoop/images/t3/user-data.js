(function($) {

	function hmuud_fetch_user_data() {

		if ( null === $.cookie( '_mkto_trk' ) ) {
			return;
		}

		$.post(
			HWXHelper.ajaxurl,
			{
				action		: 'hmuud_get_user_data',
				_mkto_trk	: $.cookie( '_mkto_trk' )
			},
			function( marketo_response ) {

				if ( hmuud_is_json( marketo_response ) ) {
					localStorage.setItem( 'marketo_userdata', marketo_response );
					$( window ).load( function() {
						$(document).trigger( 'marketo_ready', marketo_response.data );
					});
				}

			}
		);
	}

	function hmuud_sync_user_data() {

		if ( null === $.cookie( '_mkto_trk' ) ) {
			return;
		}

		$.post(
			HWXHelper.ajaxurl,
			{
				action		: 'hmuud_sync_user_data',
				_mkto_trk	: $.cookie( '_mkto_trk' ),
				syncdata	: syncdata
			},
			function( marketo_response ) {

				if ( hmuud_is_json( marketo_response ) ) {
					localStorage.removeItem( 'marketo_syncdata' );
				}
			}
		);
	}

	function hmuud_is_json( string ) {
		var json;
		try	{
			json = $.parseJSON( string );
		}
		catch( err ) {
			json = null;
		}

		return json;
	}

	var syncdata = localStorage.getItem( 'marketo_syncdata' );

	if ( null !== syncdata ) {
		hmuud_sync_user_data();
	}

	var marketo_userdata = hmuud_is_json( localStorage.getItem( 'marketo_userdata' ) );

	if ( null === marketo_userdata ) {
		hmuud_fetch_user_data();
	} else if ( HMUUD.version !== marketo_userdata.version ) {
		hmuud_fetch_user_data();
	} else {
		$( window ).load( function() {
			$(document).trigger( 'marketo_ready', marketo_userdata.data );
		});
	}

	// EXAMPLE WAY TO HOOK INTO THE NEW EVENT AND SEE MARKETO DATA
	$(document).on( 'marketo_ready', function( event, marketo_data ) {
		// console.log( marketo_data );
	});

})(jQuery);