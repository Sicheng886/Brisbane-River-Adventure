/*
This script is oringinal work of DECO7180 C01T02: Team History Fan Club
*/

$(document).ready(function () {
	renderRecords();
	$("#page-num-sec").on("click", ".page-num", function () {
		const pageNum = parseInt($(this).text());
		renderRecords(pageNum);
	});

	$("#jump-btn").click(function () {
		const maxpage = parseInt($(this).attr("data-maxpage"));
		const userInput = parseInt($("#jump-page-num").val());
		const pageNum = userInput>maxpage? maxpage: userInput;
		$("#jump-page-num").val("");
		renderRecords(pageNum);
	});
});

async function renderRecords(pageNum = 1) {
	$("#big-container").empty();
	const data = await getData(pageNum);
	console.log(data);
	$.each(data.data, function (recordKey, recordValue) {

		const recordTitle = recordValue["dc:title"];
		const recordImage = recordValue["1000_pixel_jpg"];
		let recordDescription = recordValue["dc:description"];

		if (!recordDescription) {
			recordDescription = "No description";
		}

		if (recordImage) {
			$("#big-container").append(
				$('<div class="flip-container">').append(
					$('<div class="flipper">').append(
						// font side
						$('<div class="font">').append(
							$('<img class="records-img">').attr("src", recordImage),
							$('<h4>').text(recordTitle)
						),
						// back side
						$('<div class="back">').append(
							$('<h4>').text(recordDescription)
						)


					)
				)
			);

		}
	});

	$("#page-num-sec").empty();
	const totalPage = parseInt(data.totalPage);
	$("#jump-btn").attr("data-maxpage",totalPage);
	const minRange = pageNum > 5 ? pageNum - 5 : 1;
	const maxRange = pageNum < totalPage - 5 ? pageNum + 5 : totalPage;
	$("#page-num-sec").append(
		$("<p>").text("Page Number: ")
	);

	if (minRange > 1) {
		$("#page-num-sec").append(
			$('<p class="page-num">').text("1"),
			$('<p>').text("...")
		);
	}

	for (let i = minRange; i <= maxRange; i++) {
		if (i == pageNum) {
			$("#page-num-sec").append(
				$('<p class="page-num current-page">').text(i)
			);
		} else {
			$("#page-num-sec").append(
				$('<p class="page-num">').text(i)
			);
		}
	}

	if (maxRange < totalPage) {
		$("#page-num-sec").append(
			$('<p>').text("..."),
			$('<p class="page-num">').text(totalPage)

		);
	}
}

async function getData(pageNum) {
	const startNum = (pageNum - 1) * 6;
	try {
		const response = await fetch("getGalleryContent.php", {
			method: "POST",
			body: JSON.stringify({
				startNum: startNum
			})
		});
		if (response.ok) {
			const jsonRes = response.json();
			return jsonRes;
		}
		throw new Error("connect failed, please refresh");
	} catch (error) {
		alert(error);
	}
}