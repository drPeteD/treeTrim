USE [TreeTrimming]
GO

/****** Object:  Table [dbo].[Project]    Script Date: 11/13/2018 8:20:44 AM ******/
DROP TABLE [dbo].[Project]
GO

/****** Object:  Table [dbo].[Project]    Script Date: 11/13/2018 8:20:44 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Project](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[routeId] [varchar](16) NOT NULL,
	[county] [varchar](50) NOT NULL,
	[route] [varchar](50) NOT NULL,
	[notes] [text] NULL,
	[type] [varchar](50) NOT NULL,
	[width] [int] NULL,
	[effectiveLength] [decimal](10, 3) NULL,
	[effectiveAcres] [decimal](6, 3) NULL,
	[beginLocation] [geography] NOT NULL,
	[beginMilepoint] [decimal](6, 3) NOT NULL,
	[endLocation] [geography] NULL,
	[endMilepoint] [decimal](6, 3) NULL,
	[dateReviewed] [date] NULL,
 CONSTRAINT [PK_Project] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


